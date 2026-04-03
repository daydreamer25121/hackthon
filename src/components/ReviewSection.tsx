import { useEffect, useState } from 'react'
import { fetchReviews } from '../lib/api'
import type { DbReview } from '../lib/api'
import { ReviewForm } from './ReviewForm'
import './Review.css'

interface ReviewSectionProps {
  productId: string
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<DbReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReviews = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchReviews(productId)
      setReviews(data.reviews)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [productId])

  return (
    <section className="review-section">
      <h3>Customer Reviews ({reviews.length})</h3>
      
      {loading ? (
        <p className="no-reviews">Loading reviews...</p>
      ) : error ? (
        <p className="review-form__error">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-card__header">
                <span className="review-card__user">{review.userName}</span>
                <div className="review-card__rating">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <p className="review-card__date">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
              <p className="review-card__comment">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      <ReviewForm
        productId={productId}
        onReviewAdded={() => loadReviews()}
      />
    </section>
  )
}
