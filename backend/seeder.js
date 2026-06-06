import mongoose from 'mongoose';
import dotenv from 'dotenv';
import products from './data/products.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // This will be hashed via the pre-save hook wait insertMany doesn't trigger pre save hooks for bcrypt if we just pass string, we need to create them one by one or create first user.
      }
    ]);

    // Manually hash password or create via User.create
    await User.deleteMany();
    const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true,
    });

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser._id };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
