import { Link } from 'react-router-dom'
import './Login.css'

export function LoginSelector() {
  return (
    <div className="login-shell">
      <div className="login-picker">
        <div className="login-picker__head">
          <h1>Sign in</h1>
          <p>Choose how you want to use the store.</p>
        </div>

        <div className="login-role-grid">
          <Link to="/login/user" className="login-role-card">
            <div className="login-role-card__icon" aria-hidden>
              🛒
            </div>
            <span className="login-role-card__badge">Customer</span>
            <h2 className="login-role-card__title">Shop as user</h2>
            <p className="login-role-card__desc">
              Browse categories, add items to your cart, and place orders.
            </p>
            <span className="login-role-card__cta">
              Continue →
            </span>
          </Link>

          <Link to="/login/seller" className="login-role-card">
            <div className="login-role-card__icon" aria-hidden>
              📦
            </div>
            <span className="login-role-card__badge">Merchant</span>
            <h2 className="login-role-card__title">Seller account</h2>
            <p className="login-role-card__desc">
              Add products, view your catalog size, and manage the storefront.
            </p>
            <span className="login-role-card__cta">
              Continue →
            </span>
          </Link>
        </div>

        <p className="login-home-link">
          <Link to="/">← Back to shopping</Link>
        </p>
      </div>
    </div>
  )
}
