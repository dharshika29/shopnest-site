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
      key_id: 'rzp_test_SyEGyGvB1w34O2', // Hardcoded
      key_secret: 'P1SLs1QB14Qkr0Dlot5P7lu', // Hardcoded
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
