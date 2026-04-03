import { Router } from 'express'
import mongoose from 'mongoose'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { Review } from '../models/Review.js'
import { requireAuth, requireSeller } from '../middleware/auth.js'
import { seedProducts } from '../seed/seedProducts.js'

export const productsRouter = Router()

productsRouter.get('/', async (req, res) => {
  try {
    const category = req.query.category
    const query = category ? { category } : {}
    const docs = await Product.find(query).sort({ createdAt: -1 })
    const mapped = docs.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      price: p.price,
      rating: p.rating,
      image: p.image,
      category: p.category,
      sellerId: p.sellerId?.toString() ?? 'seed',
    }))
    const all = [...mapped, ...seedProducts.map((p, i) => ({ ...p, id: `seed-${i}`, sellerId: 'seed' }))]
    const filtered = category ? all.filter((p) => p.category === category) : all
    return res.json({ products: filtered })
  } catch {
    return res.status(500).json({ message: 'Failed to load products' })
  }
})

productsRouter.get('/mine', requireAuth, requireSeller, async (req, res) => {
  try {
    const docs = await Product.find({ sellerId: req.user.userId }).sort({ createdAt: -1 })
    return res.json({
      products: docs.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        price: p.price,
        rating: p.rating,
        image: p.image,
        category: p.category,
        sellerId: p.sellerId.toString(),
      })),
    })
  } catch {
    return res.status(500).json({ message: 'Failed to load seller products' })
  }
})

productsRouter.post('/', requireAuth, requireSeller, async (req, res) => {
  try {
    const { title, price, category, image, rating } = req.body ?? {}
    if (!title || !price || !category || !image) {
      return res.status(400).json({ message: 'title, price, category, image are required' })
    }
    const created = await Product.create({
      title: String(title).trim(),
      price: Number(price),
      category,
      image: String(image).trim(),
      rating: rating ? Number(rating) : 4.5,
      sellerId: new mongoose.Types.ObjectId(req.user.userId),
    })
    return res.status(201).json({
      product: {
        id: created._id.toString(),
        title: created.title,
        price: created.price,
        rating: created.rating,
        image: created.image,
        category: created.category,
        sellerId: created.sellerId.toString(),
      },
    })
  } catch {
    return res.status(500).json({ message: 'Failed to add product' })
  }
})

// Review Routes
productsRouter.get('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params
    if (productId.startsWith('seed-')) {
      return res.json({ reviews: [] })
    }
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 })
    res.json({ reviews })
  } catch (err) {
    res.status(500).json({ message: 'Failed to load reviews' })
  }
})

productsRouter.post('/:productId/reviews', requireAuth, async (req, res) => {
  try {
    const { productId } = req.params
    const { rating, comment } = req.body
    
    if (productId.startsWith('seed-')) {
       return res.status(400).json({ message: 'Cannot review sample products. Please review an added product.' })
    }

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' })
    }

    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const review = await Review.create({
      productId,
      userId: req.user.userId,
      userName: user.name,
      rating: Number(rating),
      comment,
    })

    // Optionally update product's aggregate rating
    const allReviews = await Review.find({ productId })
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
    await Product.findByIdAndUpdate(productId, { rating: Number(avgRating.toFixed(1)) })

    res.status(201).json({ review })
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review' })
  }
})
