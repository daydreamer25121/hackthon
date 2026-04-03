import { useCart } from '../store/CartContext'
import type { Product } from '../types'
import { ReviewSection } from './ReviewSection'
import './ProductModal.css'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart()

  if (!product) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="product-details">
          <div className="product-details__grid">
            <div className="product-details__image-wrap">
              <img src={product.image} alt={product.title} />
            </div>
            <div className="product-details__info">
              <span className="product-details__category">{product.category}</span>
              <h2 className="product-details__title">{product.title}</h2>
              <div className="product-details__price">${product.price.toFixed(2)}</div>
              <button
                className="product-details__add-btn"
                onClick={() => {
                  addToCart(product)
                  onClose()
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>

          <ReviewSection productId={product.id} />
        </div>
      </div>
    </div>
  )
}
