import { Link, useParams } from 'react-router-dom'
import { categories } from '../data/products'
import { useProducts } from '../store/ProductsContext'
import { useCart } from '../store/CartContext'
import { HeaderActions } from './HeaderActions'
import { ProductModal } from './ProductModal'
import type { Product } from '../types'
import './Dashboard.css'
import { useState } from 'react'

export function CategoryPage() {
  const { allProducts } = useProducts()
  const { addToCart } = useCart()
  const params = useParams<{ category: string }>()
  const category = categories.find((item) => item.slug === params.category)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  if (!category) {
    return (
      <div className="dashboard">
        <main className="dash-main dash-main--center">
          <h2>Category not found</h2>
          <p>Please choose one from the dashboard.</p>
          <Link to="/" className="dash-card__btn dash-card__btn--inline">
            Back to categories
          </Link>
        </main>
      </div>
    )
  }

  const categoryProducts = allProducts.filter(
    (item) => item.category === category.slug,
  )

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-header__row dash-header__row--top">
          <Link to="/" className="dash-header__brand dash-header__brand--link">
            <span className="dash-header__logo">a</span>
            <span className="dash-header__title">{category.label}</span>
          </Link>
          <div className="dash-header__actions">
            <HeaderActions />
            <Link to="/" className="dash-header__link dash-header__link--plain">
              Back to categories
            </Link>
          </div>
        </div>
      </header>

      <main className="dash-main">
        <section className="dash-hero" aria-labelledby="category-title">
          <div className="dash-hero__content">
            <h1 id="category-title">{category.label}</h1>
            <p>{category.description}</p>
          </div>
        </section>

        <section className="dash-products" aria-labelledby="products-heading">
          <div className="dash-products__head">
            <h2 id="products-heading">{categoryProducts.length} products</h2>
          </div>

          <ul className="dash-grid">
            {categoryProducts.map((product) => (
              <li
                key={product.id}
                className="dash-card"
                onClick={() => setSelectedProduct(product)}
                style={{ cursor: 'pointer' }}
              >
                <article>
                  <div className="dash-card__image-wrap">
                    <img
                      src={product.image}
                      alt={product.title}
                      width={400}
                      height={400}
                      loading="lazy"
                    />
                  </div>
                  <div className="dash-card__body">
                    <span className="dash-card__badge">{category.label}</span>
                    <h3 className="dash-card__title">{product.title}</h3>
                    <div
                      className="dash-card__rating"
                      aria-label={`Rating ${product.rating} out of 5`}
                    >
                      {'★'.repeat(Math.round(product.rating))}
                      <span className="dash-card__rating-num">{product.rating}</span>
                    </div>
                    <p className="dash-card__price">${product.price.toFixed(2)}</p>
                    <button
                      type="button"
                      className="dash-card__btn"
                      onClick={() => addToCart(product)}
                    >
                      Add to cart
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
