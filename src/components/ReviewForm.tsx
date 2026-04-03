import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { addReviewRequest } from '../lib/api'
import './Review.css'

interface ReviewFormProps {
  productId: string
  onReviewAdded: () => void
}

export function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
  const { session } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!session) {
    return (
      <div className="review-form">
        <p className="no-reviews">Please login to write a review.</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    if (!comment.trim()) {
      setError('Please write a comment')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await addReviewRequest(session.token, productId, { rating, comment })
      setRating(0)
      setComment('')
      onReviewAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4>Write a Review</h4>
      
      <div className="review-form__group">
        <label className="review-form__label">Rating</label>
        <div className="review-form__stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`review-form__star-btn ${
                rating >= star ? 'review-form__star-btn--active' : ''
              }`}
              onClick={() => setRating(star)}
              aria-label={`Rate ${star} stars`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="review-form__group">
        <label htmlFor="comment" className="review-form__label">Comment</label>
        <textarea
          id="comment"
          className="review-form__input"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of this product?"
          maxLength={500}
        />
      </div>

      {error && <p className="review-form__error">{error}</p>}

      <button
        type="submit"
        className="review-form__submit"
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
