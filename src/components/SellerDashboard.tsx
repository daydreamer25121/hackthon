import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { categories, type Category } from '../data/products'
import { useAuth } from '../auth/AuthContext'
import { useProducts } from '../store/ProductsContext'
import { HeaderActions } from './HeaderActions'
import './Dashboard.css'

const DEFAULT_IMG =
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80'

export function SellerDashboard() {
  const { session } = useAuth()
  const { allProducts, addSellerProduct } = useProducts()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState<Category>(categories[0].slug)
  const [image, setImage] = useState('')
  const [formError, setFormError] = useState('')
  const [saved, setSaved] = useState(false)

  if (session?.role !== 'seller') {
    return <Navigate to="/login/seller" replace />
  }

  const onAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaved(false)
    const p = parseFloat(price)
    if (!title.trim()) {
      setFormError('Enter a product title.')
      return
    }
    if (Number.isNaN(p) || p <= 0) {
      setFormError('Enter a valid price.')
      return
    }
    try {
      await addSellerProduct({
        title: title.trim(),
        price: p,
        rating: 4.5,
        image: image.trim() || DEFAULT_IMG,
        category,
      })
      setFormError('')
      setSaved(true)
      setTitle('')
      setPrice('')
      setImage('')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to add product')
    }
  }

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-header__row dash-header__row--top">
          <Link to="/" className="dash-header__brand dash-header__brand--link">
            <span className="dash-header__logo">a</span>
            <span className="dash-header__title">Seller panel</span>
          </Link>
          <div className="dash-header__actions">
            <HeaderActions />
          </div>
        </div>
      </header>

      <main className="dash-main">
        <section className="dash-hero seller-hero">
          <div className="dash-hero__content">
            <h1 id="seller-main-heading">Add product</h1>
            <p>
              Welcome, {session.name}. List new items — they appear under the selected
              category for customers.
            </p>
          </div>
        </section>

        <section className="seller-add" aria-labelledby="seller-main-heading">
          <h2 className="seller-add__title visually-hidden">Product details</h2>
          <form className="seller-form" onSubmit={onAddProduct}>
            <label className="auth-label">
              Title
              <input
                className="auth-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Wireless earbuds"
              />
            </label>
            <label className="auth-label">
              Price (USD)
              <input
                className="auth-input"
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="29.99"
              />
            </label>
            <label className="auth-label">
              Category
              <select
                className="auth-input"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="auth-label">
              Image URL (optional)
              <input
                className="auth-input"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
              />
            </label>
            {formError && <p className="auth-error">{formError}</p>}
            {saved && (
              <p className="seller-form__ok" role="status">
                Product added to your catalog.
              </p>
            )}
            <button type="submit" className="dash-card__btn seller-form__submit">
              Add product
            </button>
          </form>
        </section>

        <section className="dash-grid dash-grid--categories">
          <article className="dash-card">
            <div className="dash-card__body">
              <span className="dash-card__badge">Overview</span>
              <h3 className="dash-card__title">{allProducts.length} total products</h3>
              <p className="dash-card__desc">Including items you added.</p>
            </div>
          </article>

          <article className="dash-card">
            <div className="dash-card__body">
              <span className="dash-card__badge">Categories</span>
              <h3 className="dash-card__title">{categories.length} active categories</h3>
              <p className="dash-card__desc">Products show under the right category page.</p>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
