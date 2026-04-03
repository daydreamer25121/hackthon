export type Category = 'clothes' | 'electronics' | 'home' | 'beauty' | 'books' | 'sports'

export interface Product {
  id: string
  title: string
  price: number
  rating: number
  image: string
  category: Category
  sellerId?: string // Optional because seed products don't have one initially
}

export interface Review {
  _id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}
