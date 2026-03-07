import { useState } from 'react'
import { MessageCircle, MapPin, ShoppingBag, MapPinned, MessageSquare, Star, ExternalLink } from 'lucide-react'
import type { Review, ReviewSource } from '../types'
import { SOURCE_LABELS } from '../types'
import { formatReviewDate } from '../lib/filterReviews'

const TRUNCATE_LENGTH = 120

const SOURCE_ICONS: Record<ReviewSource, React.ElementType> = {
  otzovik: MessageCircle,
  yandex: MapPin,
  rustore: ShoppingBag,
  '2gis': MapPinned,
  vk: MessageSquare,
}

const SENTIMENT_STYLES = {
  positive: 'bg-[#f0fdf4] text-sentiment-positive border-sentiment-positive/30',
  neutral: 'bg-gray-50 text-sentiment-neutral border-sentiment-neutral/50',
  negative: 'bg-[#fef2f2] text-sentiment-negative border-sentiment-negative/30',
} as const

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const truncated = review.text.length > TRUNCATE_LENGTH
  const displayText = expanded || !truncated ? review.text : review.text.slice(0, TRUNCATE_LENGTH) + '…'
  const Icon = SOURCE_ICONS[review.source]
  const sentimentStyle = SENTIMENT_STYLES[review.sentiment]

  return (
    <article className="bg-white rounded-xl shadow-card p-5 hover:shadow-elevated transition-shadow">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
          <Icon className="w-4 h-4 text-sber-primary" aria-hidden />
          {SOURCE_LABELS[review.source]}
        </span>
        <span className="text-sm text-gray-400">•</span>
        <time dateTime={review.date} className="text-sm text-gray-500">
          {formatReviewDate(review.date)}
        </time>
        {review.rating != null && (
          <>
            <span className="text-sm text-gray-400">•</span>
            <span className="inline-flex items-center gap-1 text-sm text-amber-600" aria-label={`Rating: ${review.rating} out of 5`}>
              <Star className="w-4 h-4 fill-current" />
              {review.rating}
            </span>
          </>
        )}
      </div>
      <p className="text-gray-800 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
        {displayText}
        {truncated && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="ml-1 text-sber-primary hover:underline font-medium"
          >
            read more
          </button>
        )}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${sentimentStyle}`}>
          {review.sentiment}
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{review.author}</span>
          <a
            href={review.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sber-primary hover:underline inline-flex items-center gap-0.5"
            aria-label="Open original review"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  )
}
