import type { Review, ReviewSource, Sentiment } from '../types'

export function filterReviews(
  reviews: Review[],
  options: {
    sources: ReviewSource[]
    dateFrom: string | null
    dateTo: string | null
    sentiment: Sentiment | 'all'
  }
): Review[] {
  return reviews.filter((r) => {
    if (!options.sources.includes(r.source)) return false
    const d = r.date
    if (options.dateFrom && d < options.dateFrom) return false
    if (options.dateTo && d > options.dateTo) return false
    if (options.sentiment !== 'all' && r.sentiment !== options.sentiment) return false
    return true
  })
}

export function formatReviewDate(iso: string): string {
  const date = new Date(iso + 'T12:00:00')
  const day = date.getDate()
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'нояб', 'дек']
  const month = months[date.getMonth()]
  return `${day} ${month}`
}
