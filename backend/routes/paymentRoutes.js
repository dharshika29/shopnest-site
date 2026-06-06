import express from 'express';
import { createRazorpayOrder } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/razorpay-order').post(protect, createRazorpayOrder);

export default router;
