import { useSearchParams } from 'react-router-dom'
import type { FilterState, ReviewSource } from '../types'

const ALL_SOURCES: ReviewSource[] = ['otzovik', 'yandex', 'rustore', '2gis', 'vk']
const SENTIMENTS = ['all', 'positive', 'neutral', 'negative'] as const

function parseSources(value: string | null): ReviewSource[] {
  if (!value) return ALL_SOURCES
  const list = value.split(',').filter((s) => ALL_SOURCES.includes(s as ReviewSource))
  return list.length ? (list as ReviewSource[]) : ALL_SOURCES
}

function parseSentiment(value: string | null): 'all' | 'positive' | 'neutral' | 'negative' {
  if (!value || !SENTIMENTS.includes(value as (typeof SENTIMENTS)[number])) return 'all'
  return value as (typeof SENTIMENTS)[number]
}

export function useFilterFromUrl(): [FilterState, (next: Partial<FilterState>) => void] {
  const [searchParams, setSearchParams] = useSearchParams()

  const state: FilterState = {
    sources: parseSources(searchParams.get('sources')),
    dateFrom: searchParams.get('dateFrom') || null,
    dateTo: searchParams.get('dateTo') || null,
    sentiment: parseSentiment(searchParams.get('sentiment')),
  }

  const setFilters = (next: Partial<FilterState>) => {
    const nextParams = new URLSearchParams(searchParams)
    if (next.sources !== undefined) {
      if (next.sources.length === 0 || next.sources.length === ALL_SOURCES.length) {
        nextParams.delete('sources')
      } else {
        nextParams.set('sources', next.sources.join(','))
      }
    }
    if (next.dateFrom !== undefined) {
      if (next.dateFrom) nextParams.set('dateFrom', next.dateFrom)
      else nextParams.delete('dateFrom')
    }
    if (next.dateTo !== undefined) {
      if (next.dateTo) nextParams.set('dateTo', next.dateTo)
      else nextParams.delete('dateTo')
    }
    if (next.sentiment !== undefined) {
      if (next.sentiment === 'all') nextParams.delete('sentiment')
      else nextParams.set('sentiment', next.sentiment)
    }
    setSearchParams(nextParams, { replace: true })
  }

  return [state, setFilters]
}
