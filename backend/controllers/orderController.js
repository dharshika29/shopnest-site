import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import sendEmail from '../utils/sendEmail.js';
import generateInvoice from '../utils/generateInvoice.js';
import crypto from 'crypto';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
  try {
    const { 
      orderItems, 
      shippingAddress, 
      paymentMethod, 
      totalPrice,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature 
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      // Verify stock for all items
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
          res.status(404);
          throw new Error(`Product not found: ${item.product}`);
        }
        if (product.stock < item.quantity) {
          res.status(400);
          throw new Error(`Insufficient stock for product: ${product.title}`);
        }
      }

      let isPaid = false;
      let paidAt = null;
      let paymentResult = {};

      if (paymentMethod === 'Razorpay') {
        if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
          res.status(400);
          throw new Error('Razorpay payment details missing');
        }

        const sign = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSign = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(sign.toString())
          .digest('hex');

        if (razorpaySignature !== expectedSign) {
          res.status(400);
          throw new Error('Invalid payment signature');
        }

        isPaid = true;
        paidAt = Date.now();
        paymentResult = {
          id: razorpayPaymentId,
          status: 'success',
          update_time: Date.now().toString(),
          email_address: req.user.email
        };
      }

      const order = new Order({
        user: req.user._id,
        products: orderItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress,
        paymentMethod,
        paymentResult,
        isPaid,
        paidAt,
        status: isPaid ? 'Paid' : 'Pending',
        totalPrice,
      });

      const createdOrder = await order.save();
      
      // Decrement stock for all items
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        product.stock -= item.quantity;
        await product.save();
      }
      
      // Clear user cart
      const user = await User.findById(req.user._id);
      user.cart = [];
      await user.save();

      // Populate order products to get titles and images for the invoice
      const populatedOrder = await Order.findById(createdOrder._id).populate('products.product', 'title image');

      // Generate PDF Invoice Buffer
      const invoiceBuffer = await generateInvoice(populatedOrder, user);

      // Send Email Notification with Attachment
      const emailHtml = `
        <h1>Order Placed Successfully!</h1>
        <p>Hi ${user.name},</p>
        <p>Thank you for your order at ShopNest.</p>
        <p><strong>Order ID:</strong> ${createdOrder._id}</p>
        <p><strong>Total Price:</strong> ₹${totalPrice.toFixed(2)}</p>
        <p>Please find your invoice attached to this email.</p>
        <p>We will notify you once your order is shipped.</p>
        <br/>
        <p>Regards,<br/>ShopNest Team</p>
      `;

      // Send Email Notification in the background (fire and forget)
      sendEmail({
        email: user.email,
        subject: 'Order Confirmation & Invoice - ShopNest',
        html: emailHtml,
        attachments: [
          {
            filename: `Invoice-${createdOrder._id}.pdf`,
            content: invoiceBuffer,
            contentType: 'application/pdf'
          }
        ]
      }).catch(err => console.error('Background email failed:', err));

      res.status(201).json({ order: createdOrder, previewUrl: null });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('products.product');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').populate('products.product');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = 'Delivered';
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order summary for dashboard
// @route   GET /api/orders/summary
// @access  Private/Admin
const getOrderSummary = async (req, res, next) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);

    const users = await User.countDocuments();
    const products = await Product.countDocuments();

    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      users,
      products,
      orders: orders.length === 0 ? 0 : orders[0].numOrders,
      sales: orders.length === 0 ? 0 : orders[0].totalSales,
      dailyOrders,
    });
  } catch (error) {
    next(error);
  }
};

export { addOrderItems, getMyOrders, getOrders, updateOrderToDelivered, getOrderSummary };
