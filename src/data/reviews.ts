import type { Review } from '../types'
import rawReviews from '../realReviews_with_links.json'

/** Нормализует дату к YYYY-MM-DD для корректной фильтрации */
function normalizeDate(iso: string): string {
  return iso.slice(0, 10)
}

const reviews = (rawReviews as Array<{
  id: string
  source: string
  date: string
  text: string
  sentiment: string
  rating?: number
  author: string
  sourceUrl: string
}>).map(
  (r): Review => ({
    id: r.id,
    source: r.source as Review['source'],
    date: normalizeDate(r.date),
    text: r.text,
    sentiment: r.sentiment as Review['sentiment'],
    rating: r.rating,
    author: r.author,
    sourceUrl: r.sourceUrl,
  })
)

export const REVIEWS: Review[] = reviews
