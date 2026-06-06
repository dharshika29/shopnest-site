import express from 'express';
import { createCoupon, getCoupons, deleteCoupon, verifyCoupon, getActiveCoupons } from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createCoupon)
  .get(protect, admin, getCoupons);

router.get('/active', protect, getActiveCoupons);

router.post('/verify', protect, verifyCoupon);

router.route('/:id')
  .delete(protect, admin, deleteCoupon);

export default router;
