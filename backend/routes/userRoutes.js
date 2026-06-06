import express from 'express';
import { getUserProfile, updateUserProfile, toggleWishlist } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('profilePic'), updateUserProfile);

router.route('/wishlist/:id')
  .post(protect, toggleWishlist);

export default router;
