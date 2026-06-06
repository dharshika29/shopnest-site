import express from 'express';
import { addToCart, updateCartQuantity, removeFromCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addToCart);

router.route('/:id')
  .put(protect, updateCartQuantity)
  .delete(protect, removeFromCart);

export default router;
