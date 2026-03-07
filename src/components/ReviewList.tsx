import { useState, useEffect } from 'react'
import type { Review } from '../types'
import { ReviewCard } from './ReviewCard'

const INITIAL_PAGE_SIZE = 10
const LOAD_MORE = 5

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  const [shown, setShown] = useState(INITIAL_PAGE_SIZE)
  useEffect(() => {
    setShown(INITIAL_PAGE_SIZE)
  }, [reviews.length])
  const slice = reviews.slice(0, shown)
  const hasMore = shown < reviews.length

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-sber-dark">
        Отзывы {reviews.length > 0 && `(${reviews.length})`}
      </h2>
      <div className="grid gap-4">
        {slice.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      {reviews.length === 0 && (
        <p className="text-gray-500 text-center py-8">Нет отзывов по выбранным фильтрам.</p>
      )}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setShown((s) => Math.min(s + LOAD_MORE, reviews.length))}
            className="px-5 py-2.5 bg-sber-primary text-white font-medium rounded-lg hover:bg-sber-dark transition-colors"
          >
            Показать ещё
          </button>
        </div>
      )}
    </section>
  )
}
