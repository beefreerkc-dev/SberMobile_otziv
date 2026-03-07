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
  otzovik: 'Оtzovik',
  yandex: 'Яндекс.Карты',
  rustore: 'RuStore',
  '2gis': '2ГИС',
  vk: 'ВКонтакте',
}

export const SENTIMENT_LABELS_RU: Record<Sentiment, string> = {
  positive: 'Позитивный',
  neutral: 'Нейтральный',
  negative: 'Негативный',
}
