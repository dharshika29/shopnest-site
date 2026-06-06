import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import configs and middlewares
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import socketManager from './sockets/socketManager.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize socket manager
socketManager(io);

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Make uploads folder static
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
