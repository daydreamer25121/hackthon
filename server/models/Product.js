import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    image: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['clothes', 'electronics', 'home', 'beauty', 'books', 'sports'],
      required: true,
    },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

export const Product = mongoose.model('Product', productSchema)
