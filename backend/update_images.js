import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://sdharshika:mongo2329@cluster0.hjdgp6q.mongodb.net/shopnest?appName=Cluster0';

const run = async () => {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  await db.collection('products').updateOne(
    { title: 'AirPods Wireless Bluetooth Headphones' },
    { $set: { image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&q=80&w=800' } }
  );

  await db.collection('products').updateOne(
    { title: 'Sony Playstation 5' },
    { $set: { image: 'https://images.unsplash.com/photo-1607459734139-3ee2ce3e8cb9?auto=format&fit=crop&q=80&w=800' } }
  );

  await db.collection('products').updateOne(
    { title: 'Logitech G-Series Gaming Mouse' },
    { $set: { image: 'https://images.unsplash.com/photo-1527814050087-379381547339?auto=format&fit=crop&q=80&w=800' } }
  );

  await db.collection('products').updateOne(
    { title: 'Logitech G-Series Gaming Mouse' },
    { $set: { image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800' } }
  );

  await db.collection('products').updateOne(
    { title: 'Amazon Echo Dot 3rd Generation' },
    { $set: { image: 'https://images.unsplash.com/photo-1568910748155-01ca989ddcb6?auto=format&fit=crop&q=80&w=800' } }
  );

  console.log('Images updated successfully!');
  process.exit(0);
};

run();
