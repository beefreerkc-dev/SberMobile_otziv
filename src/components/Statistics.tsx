import { useSearchParams } from 'react-router-dom'
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
import type { Sentiment } from '../types'
import { formatReviewDate } from '../lib/filterReviews'

export type ChartGroupBy = 'source' | 'sentiment' | 'period'

const CHART_GROUP_PARAM = 'chart'

const SOURCE_CHART_COLORS = ['#2dbd4f', '#1e7e34', '#38a169', '#48bb78', '#68d391']
const SENTIMENT_CHART_COLORS: Record<Sentiment, string> = {
  positive: '#2dbd4f',
  neutral: '#a0aec0',
  negative: '#e53e3e',
}
const PERIOD_CHART_COLORS = ['#2dbd4f', '#1e7e34', '#38a169', '#48bb78', '#68d391', '#9ae6b4', '#c6f6d5']

interface StatisticsProps {
  reviews: Review[]
  /** Week range for daily trend: [dateFrom, dateTo] */
  weekRange: [string, string]
}

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

function buildSentimentData(reviews: Review[]): { name: string; value: number; sentiment: Sentiment }[] {
  const labels: Record<Sentiment, string> = {
    positive: 'Позитивный',
    neutral: 'Нейтральный',
    negative: 'Негативный',
  }
  const counts: Record<Sentiment, number> = {
    positive: 0,
    neutral: 0,
    negative: 0,
  }
  reviews.forEach((r) => { counts[r.sentiment] += 1 })
  return (Object.entries(counts) as [Sentiment, number][])
    .map(([sentiment, value]) => ({ name: labels[sentiment], value, sentiment }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
}

function buildPeriodData(reviews: Review[], dateFrom: string, dateTo: string): { name: string; value: number; date: string }[] {
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
    .map(([date, count]) => ({
      name: formatReviewDate(date),
      value: count,
      date,
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
}

export function Statistics({ reviews, weekRange }: StatisticsProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const chartGroup = (searchParams.get(CHART_GROUP_PARAM) as ChartGroupBy) || 'source'
  const setChartGroup = (value: ChartGroupBy) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'source') next.delete(CHART_GROUP_PARAM)
    else next.set(CHART_GROUP_PARAM, value)
    setSearchParams(next, { replace: true })
  }

  const [dateFrom, dateTo] = weekRange
  const dailyData = buildDailyData(reviews, dateFrom, dateTo)
  const sourceData = buildSourceData(reviews)
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
  const sentimentData = buildSentimentData(reviews)
  const periodData = buildPeriodData(reviews, dateFrom, dateTo)

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

      {/* Круговая диаграмма: переключатель по источникам / тональности / периодам */}
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="text-sm font-medium text-gray-700">Круговая диаграмма</h3>
          <select
            value={chartGroup}
            onChange={(e) => setChartGroup(e.target.value as ChartGroupBy)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm bg-white"
            aria-label="Группировка диаграммы"
          >
            <option value="source">По источникам</option>
            <option value="sentiment">По тональности</option>
            <option value="period">По периодам</option>
          </select>
        </div>
        {(() => {
          const pieData = chartGroup === 'source' ? sourceData : chartGroup === 'sentiment' ? sentimentData : periodData
          const getCellColor = (entry: { sentiment?: Sentiment; source?: ReviewSource }, index: number) => {
            if (chartGroup === 'sentiment' && entry.sentiment) return SENTIMENT_CHART_COLORS[entry.sentiment]
            if (chartGroup === 'source') return SOURCE_CHART_COLORS[index % SOURCE_CHART_COLORS.length]
            return PERIOD_CHART_COLORS[index % PERIOD_CHART_COLORS.length]
          }
          return pieData.length > 0 ? (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    startAngle={90}
                    endAngle={-270}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={entry.name + String(entry.value)} fill={getCellColor(entry as { sentiment?: Sentiment; source?: ReviewSource }, i)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, _name: string, props: { payload?: { name?: string } }) => [`${value} отзывов`, props.payload?.name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Нет данных по выбранным фильтрам.</p>
          )
        })()}
      </div>
    </section>
  )
}
