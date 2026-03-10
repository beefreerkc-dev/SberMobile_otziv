import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import type { Review, ReviewSource } from '../types'
import { formatReviewDate } from '../lib/filterReviews'

interface StatisticsProps {
  reviews: Review[]
  /** Week range for daily trend: [dateFrom, dateTo] */
  weekRange: [string, string]
}

const SOURCE_CHART_COLORS = ['#2dbd4f', '#1e7e34', '#38a169', '#48bb78', '#68d391']

function buildDailyData(reviews: Review[], dateFrom: string, dateTo: string): { date: string; count: number; label: string }[] {
  const start = new Date(dateFrom + 'T12:00:00')
  const end = new Date(dateTo + 'T12:00:00')
  const map = new Map<string, number>()
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10)
    map.set(key, 0)
  }
  reviews.forEach((r) => {
    const key = r.date.slice(0, 10)
    if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1)
  })
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({
      date: formatReviewDate(date),
      label: date,
      count,
    }))
}

function buildSourceData(reviews: Review[]): { name: string; value: number; source: ReviewSource }[] {
  const counts: Record<ReviewSource, number> = {
    otzovik: 0,
    yandex: 0,
    rustore: 0,
    '2gis': 0,
    vk: 0,
  }
  reviews.forEach((r) => { counts[r.source] += 1 })
  const labels: Record<ReviewSource, string> = {
    otzovik: 'Оtzovik',
    yandex: 'Яндекс',
    rustore: 'RuStore',
    '2gis': '2ГИС',
    vk: 'ВК',
  }
  return (Object.entries(counts) as [ReviewSource, number][]).map(([source, value]) => ({
    name: labels[source],
    value,
    source,
  }))
}

export function Statistics({ reviews, weekRange }: StatisticsProps) {
  const [dateFrom, dateTo] = weekRange
  const dailyData = buildDailyData(reviews, dateFrom, dateTo)
  const sourceData = buildSourceData(reviews)
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

  const positive = reviews.filter((r) => r.sentiment === 'positive').length
  const neutral = reviews.filter((r) => r.sentiment === 'neutral').length
  const negative = reviews.filter((r) => r.sentiment === 'negative').length

  return (
    <section className="bg-white rounded-xl shadow-card p-6 mb-6">
      <h2 className="text-lg font-semibold text-sber-dark mb-4">Статистика</h2>

      {/* Totals and sentiment cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#f5f5f5] rounded-lg p-4">
          <p className="text-sm text-gray-600">Всего отзывов</p>
          <p className="text-2xl font-bold text-sber-dark">{reviews.length}</p>
        </div>
        <div className="bg-[#f0fdf4] rounded-lg p-4 border border-sentiment-positive/20">
          <p className="text-sm text-gray-600">Позитивные</p>
          <p className="text-2xl font-bold text-sentiment-positive">{positive}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Нейтральные</p>
          <p className="text-2xl font-bold text-sentiment-neutral">{neutral}</p>
        </div>
        <div className="bg-[#fef2f2] rounded-lg p-4 border border-sentiment-negative/20">
          <p className="text-sm text-gray-600">Негативные</p>
          <p className="text-2xl font-bold text-sentiment-negative">{negative}</p>
        </div>
      </div>

      {/* Daily trend */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Отзывов по дням</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2dbd4f" radius={[4, 4, 0, 0]} name="Отзывов" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* По источникам: полный круг, доли от 100% по отфильтрованным данным, от большего к меньшему, с 12 ч по часовой */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">По источникам</h3>
        {sourceData.length > 0 ? (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  startAngle={90}
                  endAngle={-270}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sourceData.map((_, i) => (
                    <Cell key={i} fill={SOURCE_CHART_COLORS[i % SOURCE_CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, _name: string, props: { payload?: { name?: string } }) => [`${value} отзывов`, props.payload?.name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Нет данных по выбранным фильтрам.</p>
        )}
      </div>
    </section>
  )
}
