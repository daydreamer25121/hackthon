import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { signAuthToken } from '../utils/token.js'

export const authRouter = Router()

authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body ?? {}
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (!['user', 'seller'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const created = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
    })
    const token = signAuthToken({
      userId: created._id.toString(),
      role: created.role,
      name: created.name,
      email: created.email,
    })
    return res.status(201).json({
      token,
      user: { id: created._id.toString(), name: created.name, role: created.role, email: created.email },
    })
  } catch {
    return res.status(500).json({ message: 'Failed to register' })
  }
})

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body ?? {}
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password and role are required' })
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    if (user.role !== role) return res.status(401).json({ message: 'Invalid role for this account' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = signAuthToken({
      userId: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    })
    return res.json({
      token,
      user: { id: user._id.toString(), name: user.name, role: user.role, email: user.email },
    })
  } catch {
    return res.status(500).json({ message: 'Failed to login' })
  }
})
