import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useCart } from '../store/CartContext'
import './Dashboard.css'

export function HeaderActions() {
  const { session, logout } = useAuth()
  const { totalCount } = useCart()

  return (
    <>
      {session ? (
        <>
          <span className="dash-header__welcome">
            {session.role}: {session.name}
          </span>
          {session.role === 'seller' && (
            <Link to="/seller" className="dash-header__link dash-header__link--plain">
              Seller panel
            </Link>
          )}
          <button type="button" className="dash-header__link" onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" className="dash-header__link dash-header__link--plain">
          Login
        </Link>
      )}
      <Link
        to="/cart"
        className="dash-header__cart-link"
        aria-label={`Shopping cart, ${totalCount} items`}
      >
        <svg
          className="dash-header__cart-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M6 6h15l-1.5 9h-12L6 6z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M6 6L5 3H2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="9" cy="20" r="1.6" fill="currentColor" />
          <circle cx="17" cy="20" r="1.6" fill="currentColor" />
        </svg>
        <span className="dash-header__cart-badge">{totalCount}</span>
      </Link>
    </>
  )
}
