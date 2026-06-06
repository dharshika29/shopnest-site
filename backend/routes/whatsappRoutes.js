import express from 'express';
import { broadcastWhatsAppMessage } from '../controllers/whatsappController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/broadcast', protect, broadcastWhatsAppMessage);

export default router;
