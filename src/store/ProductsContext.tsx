import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../data/products'
import { addProductRequest, fetchProducts } from '../lib/api'
import { useAuth } from '../auth/AuthContext'

type ProductsContextValue = {
  allProducts: Product[]
  loading: boolean
  addSellerProduct: (input: Omit<Product, 'id'>) => Promise<void>
  refreshProducts: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined,
)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const refreshProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchProducts()
      setAllProducts(data.products)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshProducts().catch(() => setLoading(false))
  }, [refreshProducts])

  const addSellerProduct = useCallback(
    async (input: Omit<Product, 'id'>) => {
      if (!session?.token) throw new Error('Login required')
      await addProductRequest(session.token, input)
      await refreshProducts()
    },
    [session?.token, refreshProducts],
  )

  const value = useMemo(
    () => ({ allProducts, loading, addSellerProduct, refreshProducts }),
    [allProducts, loading, addSellerProduct, refreshProducts],
  )

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}

export type { Product }
