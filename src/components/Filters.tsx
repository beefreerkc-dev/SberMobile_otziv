import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import type { FilterState, ReviewSource } from '../types'
import { SOURCE_LABELS } from '../types'

const ALL_SOURCES: ReviewSource[] = ['otzovik', 'yandex', 'rustore', '2gis', 'vk']
const SENTIMENT_OPTIONS: { value: FilterState['sentiment']; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'positive', label: 'Позитивные' },
  { value: 'neutral', label: 'Нейтральные' },
  { value: 'negative', label: 'Негативные' },
]

interface FiltersProps {
  state: FilterState
  onChange: (next: Partial<FilterState>) => void
  /** Week range for date inputs */
  weekRange: [string, string]
}

export function Filters({ state, onChange, weekRange }: FiltersProps) {
  const [open, setOpen] = useState(false)
  const [dateFrom, dateTo] = weekRange

  const toggleSource = (source: ReviewSource) => {
    const next = state.sources.includes(source)
      ? state.sources.filter((s) => s !== source)
      : [...state.sources, source]
    onChange({ sources: next.length ? next : ALL_SOURCES })
  }

  const selectAllSources = () => onChange({ sources: ALL_SOURCES })
  const clearDates = () => onChange({ dateFrom: null, dateTo: null })
  const clearSentiment = () => onChange({ sentiment: 'all' })

  const hasActiveFilters =
    state.sources.length !== ALL_SOURCES.length ||
    state.dateFrom != null ||
    state.dateTo != null ||
    state.sentiment !== 'all'

  const panel = (
    <div className="bg-white rounded-xl shadow-card p-4 space-y-4">
      {/* Source */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Источник</label>
          <button
            type="button"
            onClick={selectAllSources}
            className="text-xs text-sber-primary hover:underline"
          >
            Все
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_SOURCES.map((source) => (
            <label key={source} className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={state.sources.includes(source)}
                onChange={() => toggleSource(source)}
                className="rounded border-gray-300 text-sber-primary focus:ring-sber-primary"
              />
              <span className="text-sm">{SOURCE_LABELS[source]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Период</label>
          <button
            type="button"
            onClick={clearDates}
            className="text-xs text-sber-primary hover:underline"
          >
            Сбросить
          </button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="date"
            min={dateFrom}
            max={dateTo}
            value={state.dateFrom ?? ''}
            onChange={(e) => onChange({ dateFrom: e.target.value || null })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <span className="text-gray-400">–</span>
          <input
            type="date"
            min={dateFrom}
            max={dateTo}
            value={state.dateTo ?? ''}
            onChange={(e) => onChange({ dateTo: e.target.value || null })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Sentiment */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Тональность</label>
          <button
            type="button"
            onClick={clearSentiment}
            className="text-xs text-sber-primary hover:underline"
          >
            Сбросить
          </button>
        </div>
        <select
          value={state.sentiment}
          onChange={(e) => onChange({ sentiment: e.target.value as FilterState['sentiment'] })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {SENTIMENT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )

  return (
    <div className="mb-6">
      {/* Desktop: always show */}
      <div className="hidden md:block">{panel}</div>

      {/* Mobile: hamburger + sheet */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 w-full justify-center py-3 bg-white rounded-xl shadow-card border border-gray-200"
        >
          <Filter className="w-4 h-4" />
          <span>Фильтры</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-sber-primary" aria-hidden />
          )}
        </button>
        {open && (
          <div
            className="fixed inset-0 z-50 bg-black/30 flex flex-col items-end"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-label="Фильтры"
          >
            <div
              className="w-full max-w-sm h-full bg-[#f5f5f5] shadow-xl overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b flex items-center justify-between px-4 py-3">
                <h3 className="font-semibold">Фильтры</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Закрыть"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">{panel}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
