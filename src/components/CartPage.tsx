import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HeaderActions } from './HeaderActions'
import { useCart } from '../store/CartContext'
import './Dashboard.css'

export function CartPage() {
  const { lines, subtotal, removeLine, setQuantity, placeOrder } = useCart()
  const [orderedTotal, setOrderedTotal] = useState<number | null>(null)

  useEffect(() => {
    if (lines.length > 0) setOrderedTotal(null)
  }, [lines])

  const handleOrder = () => {
    if (lines.length === 0) return
    const total = placeOrder()
    setOrderedTotal(total)
  }

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-header__row dash-header__row--top">
          <Link to="/" className="dash-header__brand dash-header__brand--link">
            <span className="dash-header__logo">a</span>
            <span className="dash-header__title">Cart</span>
          </Link>
          <div className="dash-header__actions">
            <HeaderActions />
          </div>
        </div>
      </header>

      <main className="dash-main cart-main">
        {orderedTotal !== null && (
          <div className="cart-success" role="status">
            <p>
              <strong>Order placed.</strong> Total paid: ${orderedTotal.toFixed(2)}
            </p>
            <Link to="/" className="dash-card__btn dash-card__btn--inline">
              Continue shopping
            </Link>
          </div>
        )}

        <h1 className="cart-title">Your cart</h1>

        {lines.length === 0 && orderedTotal === null ? (
          <p className="dash-empty">
            Your cart is empty.{' '}
            <Link to="/">Browse categories</Link>
          </p>
        ) : orderedTotal !== null ? null : (
          <>
            <ul className="cart-list">
              {lines.map((line) => (
                <li key={line.productId} className="cart-row">
                  <img
                    src={line.image}
                    alt=""
                    width={80}
                    height={80}
                    className="cart-row__img"
                  />
                  <div className="cart-row__info">
                    <h2 className="cart-row__title">{line.title}</h2>
                    <p className="cart-row__price">
                      ${line.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="cart-row__qty">
                    <button
                      type="button"
                      className="cart-row__qty-btn"
                      onClick={() =>
                        setQuantity(line.productId, line.quantity - 1)
                      }
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="cart-row__qty-val">{line.quantity}</span>
                    <button
                      type="button"
                      className="cart-row__qty-btn"
                      onClick={() =>
                        setQuantity(line.productId, line.quantity + 1)
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-row__line-total">
                    ${(line.price * line.quantity).toFixed(2)}
                  </div>
                  <button
                    type="button"
                    className="cart-row__remove"
                    onClick={() => removeLine(line.productId)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <p className="cart-summary__sub">
                Subtotal: <strong>${subtotal.toFixed(2)}</strong>
              </p>
              <button
                type="button"
                className="dash-card__btn cart-summary__order"
                onClick={handleOrder}
              >
                Place order
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
