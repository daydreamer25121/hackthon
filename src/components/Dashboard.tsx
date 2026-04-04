import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/products'
import { useProducts } from '../store/ProductsContext'
import { HeaderActions } from './HeaderActions'
import { SkinToneSuggester, type SkinToneResult } from './SkinToneSuggester'
import { OutfitSuggester } from './OutfitSuggester'
import './Dashboard.css'

export function Dashboard() {
  const { allProducts } = useProducts()
  const [skinToneResult, setSkinToneResult] = useState<SkinToneResult | null>(null)

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-header__row dash-header__row--top">
          <Link to="/" className="dash-header__brand dash-header__brand--link">
            <span className="dash-header__logo">a</span>
            <span className="dash-header__title">Shop</span>
          </Link>
          <div className="dash-header__search" role="search">
            <input
              type="search"
              placeholder="Search products"
              className="dash-header__search-input"
              aria-label="Search products"
            />
            <button type="button" className="dash-header__search-btn">
              Search
            </button>
          </div>
          <div className="dash-header__actions">
            <HeaderActions />
          </div>
        </div>
        <nav className="dash-header__nav" aria-label="Departments">
          <Link to="/" className="dash-header__nav-all">
            Categories
          </Link>
          <span className="dash-header__nav-links">
            <a href="#deals">Today&apos;s Deals</a>
            <a href="#gift">Gift Cards</a>
            <a href="#help">Customer Service</a>
          </span>
        </nav>
      </header>

      <main className="dash-main">
        <section className="dash-hero" aria-labelledby="hero-heading">
          <div className="dash-hero__content">
            <h1 id="hero-heading">Shop by categories</h1>
            <p>
              Pick a category card to open a dedicated page with products from
              that category.
            </p>
          </div>
        </section>

        <SkinToneSuggester result={skinToneResult} onResult={setSkinToneResult} />
        <OutfitSuggester skinTone={skinToneResult?.palette} />

        <section className="dash-products" aria-labelledby="categories-heading">
          <div className="dash-products__head">
            <h2 id="categories-heading">Category cards</h2>
            <p className="dash-products__meta">
              {categories.length} categories • {allProducts.length} products
            </p>
          </div>

          <ul className="dash-grid dash-grid--categories">
            {categories.map((category) => (
              <li key={category.slug} className="dash-card">
                <Link
                  to={`/category/${category.slug}`}
                  className="dash-card__link"
                  aria-label={`Open ${category.label} products`}
                >
                  <article>
                    <div className="dash-card__image-wrap">
                      <img
                        src={category.image}
                        alt={category.label}
                        width={800}
                        height={400}
                        loading="lazy"
                      />
                    </div>
                    <div className="dash-card__body">
                      <span className="dash-card__badge">Category</span>
                      <h3 className="dash-card__title">{category.label}</h3>
                      <p className="dash-card__desc">{category.description}</p>
                      <span className="dash-card__btn">Open category</span>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="dash-footer">
        <p>© {new Date().getFullYear()} Shop — demo storefront</p>
      </footer>
    </div>
  )
}
