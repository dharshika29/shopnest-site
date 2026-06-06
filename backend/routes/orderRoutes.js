import express from 'express';
import { addOrderItems, getMyOrders, getOrders, updateOrderToDelivered, getOrderSummary } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/summary').get(protect, admin, getOrderSummary);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
