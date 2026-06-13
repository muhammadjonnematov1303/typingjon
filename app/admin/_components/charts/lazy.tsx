'use client'

import dynamic from 'next/dynamic'

// recharts is a heavy client-only dependency — code-split it into its own chunk
// and skip SSR (ResponsiveContainer needs a real viewport to measure) so admin
// pages don't ship/parse its JS until a chart actually scrolls into view.
const ChartSkeleton = () => (
  <div className="h-[220px] w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
)

export const TrendChart = dynamic(
  () => import('./trend-chart').then(m => m.TrendChart),
  { ssr: false, loading: ChartSkeleton },
)

export const RankBarChart = dynamic(
  () => import('./rank-bar-chart').then(m => m.RankBarChart),
  { ssr: false, loading: ChartSkeleton },
)
