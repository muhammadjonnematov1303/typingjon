import { getDb } from '@/lib/prisma'
import { getLessons } from '@/lib/lessons'
import { BarChart3, TrendingUp, Target, Users2, Flame } from 'lucide-react'
import { TrendChart, RankBarChart } from '../_components/charts/lazy'
import { EmptyState } from '../_components/empty-state'
import { dayKey, dayLabel, lastNDays } from '../_lib/chart-utils'
import { CARD, TABLE_HEAD_ROW, TABLE_HEAD_LABEL, ROW, GRID_STATS_LESSONS, PAGE_TITLE, PAGE_SUBTITLE } from '../_lib/ui'
import { cn } from '@/lib/utils'

const RANGE = 90

async function getAnalytics() {
  const db = getDb()
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - (RANGE - 1)); cutoff.setHours(0, 0, 0, 0)

  const [completed, newUsers, totalUsers, completionGroups, lessons] = await Promise.all([
    db.lessonProgress.findMany({
      where:  { completed: true, completedAt: { gte: cutoff } },
      select: { completedAt: true, bestWpm: true, bestAccuracy: true },
    }),
    db.user.findMany({ where: { createdAt: { gte: cutoff } }, select: { createdAt: true } }),
    db.user.count(),
    db.lessonProgress.groupBy({ by: ['lessonId'], where: { completed: true }, _count: { _all: true } }),
    getLessons(),
  ])

  const days = lastNDays(RANGE)

  // WPM / accuracy daily averages
  const byDay = new Map<number, { wpms: number[]; accs: number[] }>()
  for (const r of completed) {
    if (!r.completedAt) continue
    const k = dayKey(r.completedAt)
    if (!byDay.has(k)) byDay.set(k, { wpms: [], accs: [] })
    const bucket = byDay.get(k)!
    if (r.bestWpm != null) bucket.wpms.push(r.bestWpm)
    if (r.bestAccuracy != null) bucket.accs.push(r.bestAccuracy)
  }
  const wpmTrend = days.map(d => {
    const b = byDay.get(dayKey(d))
    const avg = b?.wpms.length ? Math.round(b.wpms.reduce((a, c) => a + c, 0) / b.wpms.length) : 0
    return { label: dayLabel(d), value: avg }
  })
  const accuracyTrend = days.map(d => {
    const b = byDay.get(dayKey(d))
    const avg = b?.accs.length ? Math.round(b.accs.reduce((a, c) => a + c, 0) / b.accs.length) : 0
    return { label: dayLabel(d), value: avg }
  })

  // Cumulative user growth
  const newUserDays = new Map<number, number>()
  for (const u of newUsers) {
    const k = dayKey(u.createdAt)
    newUserDays.set(k, (newUserDays.get(k) ?? 0) + 1)
  }
  const baseline = totalUsers - newUsers.length
  let running = baseline
  const userGrowth = days.map(d => {
    running += newUserDays.get(dayKey(d)) ?? 0
    return { label: dayLabel(d), value: running }
  })

  // Lesson completion rate + popularity
  const lessonStats = lessons.map(l => {
    const group = completionGroups.find(g => g.lessonId === l.id)
    const count = group?._count._all ?? 0
    return {
      id:    l.id,
      title: l.title,
      count,
      rate:  totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
    }
  })
  const popular = [...lessonStats].sort((a, b) => b.count - a.count).slice(0, 8).map(l => ({ label: l.title, value: l.count }))

  return { wpmTrend, accuracyTrend, userGrowth, lessonStats, popular, totalUsers }
}

export default async function AdminStatsPage() {
  const data = await getAnalytics()

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className={PAGE_TITLE}>
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Statistika
        </h1>
        <p className={PAGE_SUBTITLE}>Tizim bo&apos;yicha chuqur tahlil — so&apos;nggi {RANGE} kun</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={cn(CARD, 'p-5')}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            WPM tendensiyasi
          </h2>
          <TrendChart data={data.wpmTrend} color="#2563EB" unit=" wpm" />
        </div>
        <div className={cn(CARD, 'p-5')}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Target className="h-4 w-4 text-rose-600" />
            Aniqlik tendensiyasi
          </h2>
          <TrendChart data={data.accuracyTrend} color="#FB7185" unit="%" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={cn(CARD, 'p-5')}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Users2 className="h-4 w-4 text-emerald-600" />
            Foydalanuvchilar o&apos;sishi (jami, kumulyativ)
          </h2>
          <TrendChart data={data.userGrowth} color="#34D399" />
        </div>
        <div className={cn(CARD, 'p-5')}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Flame className="h-4 w-4 text-orange-500" />
            Mashhur darslar
          </h2>
          {data.popular.length === 0
            ? <EmptyState icon={Flame} title="Hali ma'lumot yo'q" subtitle="Darslar yakunlangach mashhurlik reytingi shu yerda chiqadi" />
            : <RankBarChart data={data.popular} color="#FB923C" />}
        </div>
      </div>

      {/* Lesson completion rates table */}
      <div className={cn(CARD, 'overflow-hidden')}>
        <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Darslar bo&apos;yicha yakunlash darajasi</h2>
        </div>
        <div className={cn(TABLE_HEAD_ROW, GRID_STATS_LESSONS)}>
          {['Dars', 'Yakunlagan', 'Foiz (jami foydalanuvchidan)'].map(h => (
            <span key={h} className={TABLE_HEAD_LABEL}>{h}</span>
          ))}
        </div>
        {data.lessonStats.length === 0 ? (
          <EmptyState icon={BarChart3} title="Hali ma'lumot yo'q" subtitle="Darslar yaratilgach statistika shu yerda chiqadi" />
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {data.lessonStats.map(l => (
              <div key={l.id} className={cn(ROW, GRID_STATS_LESSONS)}>
                <span className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{l.title}</span>
                <span className="font-mono text-sm text-slate-500 dark:text-slate-400">{l.count} ta</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full max-w-[160px] overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${l.rate}%` }} />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">{l.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
