/** Review source identifiers matching the specified sites */
export type ReviewSource = 'otzovik' | 'yandex' | 'rustore' | '2gis' | 'vk'

export type Sentiment = 'positive' | 'neutral' | 'negative'

export interface Review {
  id: string | number
  source: ReviewSource
  date: string // ISO date
  text: string
  sentiment: Sentiment
  rating?: number // 1–5, if applicable
  author: string
  sourceUrl: string
}

export interface FilterState {
  sources: ReviewSource[]
  dateFrom: string | null
  dateTo: string | null
  sentiment: Sentiment | 'all'
}

export const SOURCE_LABELS: Record<ReviewSource, string> = {
  otzovik: 'Otzovik',
  yandex: 'Yandex Maps',
  rustore: 'Rustore',
  '2gis': '2GIS',
  vk: 'VK',
}
