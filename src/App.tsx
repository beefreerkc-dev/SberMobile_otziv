import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useFilterFromUrl } from './hooks/useFilterFromUrl'
import { filterReviews } from './lib/filterReviews'
import { REVIEWS } from './data/reviews'
import { Header } from './components/Header'
import { Statistics } from './components/Statistics'
import { Filters } from './components/Filters'
import { ReviewList } from './components/ReviewList'

/** Диапазон дат по фактическим отзывам для фильтра и графика */
const [WEEK_START, WEEK_END]: [string, string] = (() => {
  if (REVIEWS.length === 0) return ['2026-03-01', '2026-03-07']
  const dates = REVIEWS.map((r) => r.date)
  const sorted = [...dates].sort()
  return [sorted[0]!, sorted[sorted.length - 1]!]
})()

function MonitorPage() {
  const [filters, setFilters] = useFilterFromUrl()
  const filtered = filterReviews(REVIEWS, {
    sources: filters.sources,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    sentiment: filters.sentiment,
  })

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6">
        <Header />
        <div className="mb-6">
          <Statistics reviews={filtered} weekRange={[WEEK_START, WEEK_END]} />
        </div>
        <div className="md:grid md:grid-cols-[280px_1fr] md:gap-6">
          <aside className="hidden md:block md:sticky md:top-6 md:self-start">
            <Filters
              state={filters}
              onChange={setFilters}
              weekRange={[WEEK_START, WEEK_END]}
            />
          </aside>
          <div>
            <div className="md:hidden mb-4">
              <Filters
                state={filters}
                onChange={setFilters}
                weekRange={[WEEK_START, WEEK_END]}
              />
            </div>
            <ReviewList reviews={filtered} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MonitorPage />} />
      </Routes>
    </BrowserRouter>
  )
}
