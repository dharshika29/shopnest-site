import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  deleteProductReview,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, upload.single('image'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.single('image'), updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id/reviews/:reviewId').delete(protect, admin, deleteProductReview);

export default router;
