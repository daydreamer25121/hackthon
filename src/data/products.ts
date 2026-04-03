export const categories = [
  {
    slug: 'clothes',
    label: 'Clothes',
    description: 'T-shirts, denim, jackets and seasonal essentials.',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
  },
  {
    slug: 'electronics',
    label: 'Electronics',
    description: 'Headphones, wearables and smart tech.',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
  },
  {
    slug: 'home',
    label: 'Home',
    description: 'Decor, kitchen, storage and lifestyle picks.',
    image:
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80',
  },
  {
    slug: 'beauty',
    label: 'Beauty',
    description: 'Skincare, cosmetics and self-care products.',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
  },
  {
    slug: 'books',
    label: 'Books',
    description: 'Bestsellers, learning, fiction and productivity.',
    image:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
  },
  {
    slug: 'sports',
    label: 'Sports',
    description: 'Fitness and outdoor gear for active routines.',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  },
] as const

export type Category = (typeof categories)[number]['slug']

export type Product = {
  id: string
  title: string
  price: number
  rating: number
  image: string
  category: Category
}

export const products: Product[] = [
  {
    id: 'c1',
    title: 'Classic Cotton Crew Neck Tee',
    price: 19.99,
    rating: 4.5,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    category: 'clothes',
  },
  {
    id: 'c2',
    title: 'Slim Fit Denim Jeans',
    price: 49.99,
    rating: 4.3,
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
    category: 'clothes',
  },
  {
    id: 'c3',
    title: 'Wool Winter Jacket',
    price: 129.99,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
    category: 'clothes',
  },
  {
    id: 'c4',
    title: 'Running Sneakers',
    price: 89.99,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    category: 'clothes',
  },
  {
    id: 'c5',
    title: 'Knit Beanie Hat',
    price: 24.99,
    rating: 4.2,
    image:
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80',
    category: 'clothes',
  },
  {
    id: 'e1',
    title: 'Wireless Noise-Canceling Headphones',
    price: 199.99,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    category: 'electronics',
  },
  {
    id: 'e2',
    title: 'Smart Watch Pro',
    price: 299.99,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    category: 'electronics',
  },
  {
    id: 'e3',
    title: 'Ultra HD 4K Monitor 27"',
    price: 349.99,
    rating: 4.5,
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
    category: 'electronics',
  },
  {
    id: 'e4',
    title: 'Mechanical Gaming Keyboard',
    price: 119.99,
    rating: 4.4,
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
    category: 'electronics',
  },
  {
    id: 'e5',
    title: 'Portable Bluetooth Speaker',
    price: 79.99,
    rating: 4.3,
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e2?w=400&q=80',
    category: 'electronics',
  },
  {
    id: 'e6',
    title: 'Mirrorless Camera Kit',
    price: 899.99,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
    category: 'electronics',
  },
  {
    id: 'h1',
    title: 'Modern Table Lamp',
    price: 44.99,
    rating: 4.4,
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80',
    category: 'home',
  },
  {
    id: 'h2',
    title: 'Ceramic Dinnerware Set',
    price: 69.99,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&q=80',
    category: 'home',
  },
  {
    id: 'h3',
    title: 'Minimal Wall Clock',
    price: 32.99,
    rating: 4.2,
    image:
      'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&q=80',
    category: 'home',
  },
  {
    id: 'b1',
    title: 'Hydrating Face Serum',
    price: 29.99,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
    category: 'beauty',
  },
  {
    id: 'b2',
    title: 'Matte Lipstick Set',
    price: 24.99,
    rating: 4.3,
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    category: 'beauty',
  },
  {
    id: 'bk1',
    title: 'Atomic Habits',
    price: 14.99,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&q=80',
    category: 'books',
  },
  {
    id: 'bk2',
    title: 'Deep Work',
    price: 12.99,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    category: 'books',
  },
  {
    id: 's1',
    title: 'Adjustable Dumbbells Pair',
    price: 159.99,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&q=80',
    category: 'sports',
  },
  {
    id: 's2',
    title: 'Yoga Mat Pro Grip',
    price: 35.99,
    rating: 4.5,
    image:
      'https://images.unsplash.com/photo-1599447292412-0e95f0fefee5?w=400&q=80',
    category: 'sports',
  },
]
