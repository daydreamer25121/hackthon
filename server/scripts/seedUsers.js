import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { connectDb } from '../config/db.js'
import { User } from '../models/User.js'

async function seedUsers() {
  await connectDb(process.env.MONGODB_URI)
  
  const passwordHash = await bcrypt.hash('abcd', 10)

  // Clear existing users with these emails to avoid conflicts
  await User.deleteMany({ email: { $in: ['y@abc.com', 's@abc.com'] } })

  // Create Seller
  await User.create({
    name: 'Yash Seller',
    email: 'y@abc.com',
    passwordHash,
    role: 'seller'
  })

  // Create Buyer
  await User.create({
    name: 'Sange Buyer',
    email: 's@abc.com',
    passwordHash,
    role: 'user'
  })

  console.log('Users seeded successfully!')
  console.log('Seller: y@abc.com / abcd')
  console.log('Buyer: s@abc.com / abcd')
  process.exit(0)
}

seedUsers().catch(err => {
  console.error(err)
  process.exit(1)
})
