import Razorpay from 'razorpay';
import crypto from 'crypto';

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay-order
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      res.status(400);
      throw new Error('Amount is required');
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SyEGyGvB1w34O2',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'P1SLs1QB14Qkr0Dlot5P7lu',
    });

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
      res.status(500);
      throw new Error('Some error occured while creating Razorpay order');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export { createRazorpayOrder };
