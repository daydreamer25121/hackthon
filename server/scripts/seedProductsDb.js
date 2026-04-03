import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDb } from '../config/db.js'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { seedProducts } from '../seed/seedProducts.js'

async function seed() {
  await connectDb(process.env.MONGODB_URI)
  
  // Create a default seller if not exists
  let seller = await User.findOne({ role: 'seller' })
  if (!seller) {
    seller = await User.create({
      name: 'System Seller',
      email: 'seller@seed.com',
      passwordHash: 'dummy-hash',
      role: 'seller'
    })
  }

  const productsWithSeller = seedProducts.map(p => ({
    ...p,
    sellerId: seller._id
  }))

  await Product.deleteMany({})
  await Product.insertMany(productsWithSeller)
  
  console.log('Database seeded with products!')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
