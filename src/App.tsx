import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import { CartPage } from './components/CartPage'
import { CategoryPage } from './components/CategoryPage'
import { Dashboard } from './components/Dashboard'
import { LoginPage } from './components/LoginPage'
import { LoginSelector } from './components/LoginSelector'
import { LoadingScreen } from './components/LoadingScreen'
import { SellerDashboard } from './components/SellerDashboard'
import './App.css'

const SPLASH_MS = 2000

export default function App() {
  const [loading, setLoading] = useState(true)
  const { session } = useAuth()

  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), SPLASH_MS)
    return () => window.clearTimeout(id)
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginSelector />} />
      <Route path="/login/:role" element={<LoginPage />} />
      <Route
        path="/seller"
        element={
          session?.role === 'seller' ? (
            <SellerDashboard />
          ) : (
            <Navigate to="/login/seller" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
