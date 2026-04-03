const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

type ApiOptions = RequestInit & {
  token?: string
}

async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers ?? {})
  headers.set('Content-Type', 'application/json')
  if (options.token) headers.set('Authorization', `Bearer ${options.token}`)

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data as T
}

export type AuthPayload = {
  token: string
  user: { id: string; name: string; role: 'user' | 'seller'; email: string }
}

export function loginRequest(input: {
  email: string
  password: string
  role: 'user' | 'seller'
}) {
  return apiFetch<AuthPayload>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function registerRequest(input: {
  name: string
  email: string
  password: string
  role: 'user' | 'seller'
}) {
  return apiFetch<AuthPayload>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export type DbProduct = {
  id: string
  title: string
  price: number
  rating: number
  image: string
  category: 'clothes' | 'electronics' | 'home' | 'beauty' | 'books' | 'sports'
  sellerId: string
}

export function fetchProducts(category?: string) {
  const q = category ? `?category=${encodeURIComponent(category)}` : ''
  return apiFetch<{ products: DbProduct[] }>(`/products${q}`)
}

export function fetchMyProducts(token: string) {
  return apiFetch<{ products: DbProduct[] }>('/products/mine', { token })
}

export function addProductRequest(
  token: string,
  input: Omit<DbProduct, 'id' | 'sellerId'>,
) {
  return apiFetch<{ product: DbProduct }>('/products', {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  })
}

import type { Review as DbReview } from '../types'

export type { DbReview }

export function fetchReviews(productId: string) {
  return apiFetch<{ reviews: DbReview[] }>(`/products/${productId}/reviews`)
}

export function addReviewRequest(
  token: string,
  productId: string,
  input: { rating: number; comment: string },
) {
  return apiFetch<{ review: DbReview }>(`/products/${productId}/reviews`, {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  })
}
