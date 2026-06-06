import express from 'express';
import { getChatHistory, getContacts } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, getContacts);
router.get('/:userId', protect, getChatHistory);

export default router;
