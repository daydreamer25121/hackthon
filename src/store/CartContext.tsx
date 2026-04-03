import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../data/products'

export type CartLine = {
  productId: string
  title: string
  price: number
  image: string
  quantity: number
}

const CART_KEY = 'amazon-shop-cart'

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLine[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

type CartContextValue = {
  lines: CartLine[]
  totalCount: number
  subtotal: number
  addToCart: (product: Product) => void
  removeLine: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  placeOrder: () => number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function persistLines(next: CartLine[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(next))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => readCart())

  const addToCart = useCallback((product: Product) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id)
      const next = existing
        ? prev.map((l) =>
            l.productId === product.id
              ? { ...l, quantity: l.quantity + 1 }
              : l,
          )
        : [
            ...prev,
            {
              productId: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
              quantity: 1,
            },
          ]
      persistLines(next)
      return next
    })
  }, [])

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => {
      const next = prev.filter((l) => l.productId !== productId)
      persistLines(next)
      return next
    })
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const q = Math.max(0, Math.floor(quantity))
    setLines((prev) => {
      let next: CartLine[]
      if (q === 0) {
        next = prev.filter((l) => l.productId !== productId)
      } else {
        next = prev.map((l) =>
          l.productId === productId ? { ...l, quantity: q } : l,
        )
      }
      persistLines(next)
      return next
    })
  }, [])

  const placeOrder = useCallback(() => {
    let total = 0
    setLines((prev) => {
      total = prev.reduce((sum, l) => sum + l.price * l.quantity, 0)
      persistLines([])
      return []
    })
    return total
  }, [])

  const totalCount = useMemo(
    () => lines.reduce((n, l) => n + l.quantity, 0),
    [lines],
  )

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines],
  )

  const value = useMemo(
    () => ({
      lines,
      totalCount,
      subtotal,
      addToCart,
      removeLine,
      setQuantity,
      placeOrder,
    }),
    [
      lines,
      totalCount,
      subtotal,
      addToCart,
      removeLine,
      setQuantity,
      placeOrder,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
