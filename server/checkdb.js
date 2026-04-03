// server/checkDb.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Show all Users
    const users = await User.find({}).select('name email role -passwordHash');
    console.log(`👤 USERS (${users.length} found):`);
    users.forEach(u => {
      console.log(`   • ${u.name} | ${u.email} | Role: ${u.role}`);
    });

    // Show Products count per category
    const products = await Product.find({}).select('title category price rating sellerId');
    console.log(`\n📦 PRODUCTS (${products.length} total):`);
    
    const electronics = products.filter(p => p.category === 'Electronics');
    const fashion = products.filter(p => p.category === 'Fashion');
    
    console.log(`   Electronics : ${electronics.length} products`);
    console.log(`   Fashion     : ${fashion.length} products`);

    // Show first 3 products as sample
    console.log('\nSample Products:');
    products.slice(0, 3).forEach(p => {
      console.log(`   • ${p.title} (${p.category}) - ₹${p.price}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

checkDatabase();