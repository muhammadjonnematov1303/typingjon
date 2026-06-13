import { getDb } from '@/lib/prisma'
import { getLessons } from '@/lib/lessons'
import { getQadamRanking } from '@/lib/ranking'
import { cn } from '@/lib/utils'
import { Users, BookOpen, Trophy, Activity, UserCheck, Gauge, Target, Wallet, BarChart3, LayoutDashboard } from 'lucide-react'
import { StatCard } from './_components/stat-card'
import { EmptyState } from './_components/empty-state'
import { TrendChart, RankBarChart } from './_components/charts/lazy'
import { dayKey, dayLabel, lastNDays } from './_lib/chart-utils'
import { CARD, LIST_ROW, PAGE_TITLE, PAGE_SUBTITLE } from './_lib/ui'
import { AutoRefresh } from '@/components/auto-refresh'

async function getOverview() {
  const db = getDb()
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0)
  const growthCutoff = new Date(); growthCutoff.setDate(growthCutoff.getDate() - 29); growthCutoff.setHours(0, 0, 0, 0)
  const activeCutoff = new Date(); activeCutoff.setDate(activeCutoff.getDate() - 13); activeCutoff.setHours(0, 0, 0, 0)

  const [
    totalUsers, totalLessonsCount, totalAttempts, avgAgg,
    activeTodayRows, ranking, newUsers, activeRows, completionGroups, lessons,
  ] = await Promise.all([
    db.user.count(),
    db.lesson.count(),
    db.lessonProgress.aggregate({ _sum: { attempts: true } }),
    db.lessonProgress.aggregate({ where: { completed: true }, _avg: { bestWpm: true, bestAccuracy: true } }),
    db.lessonProgress.findMany({ where: { updatedAt: { gte: startOfToday } }, select: { userId: true } }),
    getQadamRanking(),
    db.user.findMany({ where: { createdAt: { gte: growthCutoff } }, select: { createdAt: true } }),
    db.lessonProgress.findMany({ where: { updatedAt: { gte: activeCutoff } }, select: { userId: true, updatedAt: true } }),
    db.lessonProgress.groupBy({ by: ['lessonId'], where: { completed: true }, _count: { _all: true } }),
    getLessons(),
  ])

  // Top performers — same shared qadam ranking as the leaderboards, just the top 5
  const top = ranking.slice(0, 5).map(e => ({ rank: e.rank, name: e.name, email: e.email, qadam: e.qadam }))

  // User growth — last 30 days, daily new signups
  const growthDays = lastNDays(30)
  const newUserDays = new Map<number, number>()
  for (const u of newUsers) {
    const k = dayKey(u.createdAt)
    newUserDays.set(k, (newUserDays.get(k) ?? 0) + 1)
  }
  const userGrowth = growthDays.map(d => ({ label: dayLabel(d), value: newUserDays.get(dayKey(d)) ?? 0 }))

  // Daily active users — last 14 days, distinct users per day
  const activeDays = lastNDays(14)
  const activeByDay = new Map<number, Set<string>>()
  for (const r of activeRows) {
    const k = dayKey(r.updatedAt)
    if (!activeByDay.has(k)) activeByDay.set(k, new Set())
    activeByDay.get(k)!.add(r.userId)
  }
  const dailyActive = activeDays.map(d => ({ label: dayLabel(d), value: activeByDay.get(dayKey(d))?.size ?? 0 }))

  // Lesson completion analytics — how many users finished each lesson.
  // Sorted by step number ("N-qadam") so it reads in order, first 8 steps.
  const lessonOrder = new Map(lessons.map(l => [l.id, l.order]))
  const completion = completionGroups
    .map(g => ({ order: lessonOrder.get(g.lessonId), value: g._count._all }))
    .filter((g): g is { order: number; value: number } => g.order != null)
    .sort((a, b) => a.order - b.order)
    .slice(0, 8)
    .map(g => ({ label: `${g.order}-qadam`, value: g.value }))

  return {
    totalUsers,
    activeToday: new Set(activeTodayRows.map(r => r.userId)).size,
    totalLessons: totalLessonsCount,
    totalAttempts: totalAttempts._sum.attempts ?? 0,
    avgWpm: Math.round(avgAgg._avg.bestWpm ?? 0),
    avgAccuracy: Math.round(avgAgg._avg.bestAccuracy ?? 0),
    top,
    userGrowth,
    dailyActive,
    completion,
  }
}

export default async function AdminDashboardPage() {
  const data = await getOverview()

  const cards = [
    { icon: Users,    label: 'Jami foydalanuvchilar',  value: data.totalUsers,     color: 'text-blue-600',    bg: 'bg-blue-50'    },
    { icon: UserCheck, label: 'Bugungi faol foydalanuvchilar', value: data.activeToday, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: BookOpen, label: 'Jami darslar',           value: data.totalLessons,   color: 'text-violet-600',  bg: 'bg-violet-50'  },
    { icon: Activity, label: 'Jami urinishlar',        value: data.totalAttempts,  color: 'text-indigo-600',  bg: 'bg-indigo-50'  },
    { icon: Gauge,    label: "O'rtacha WPM",           value: data.avgWpm,         color: 'text-orange-500',  bg: 'bg-orange-50'  },
    { icon: Target,   label: "O'rtacha aniqlik",       value: `${data.avgAccuracy}%`, color: 'text-rose-600', bg: 'bg-rose-50'    },
  ]

  return (
    <div className="space-y-4 p-6">
      <AutoRefresh />
      <div>
        <h1 className={PAGE_TITLE}>
          <LayoutDashboard className="h-5 w-5 text-blue-600" />
          Boshqaruv paneli
        </h1>
        <p className={PAGE_SUBTITLE}>Tizim bo&apos;yicha umumiy ko&apos;rsatkichlar</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(c => <StatCard key={c.label} {...c} />)}
        <StatCard icon={Wallet} label="Daromad — tez orada" value="—" color="text-slate-400" bg="bg-slate-100" muted />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={cn(CARD, 'p-5')}>
          <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Foydalanuvchilar o&apos;sishi (30 kun)</h2>
          <TrendChart data={data.userGrowth} color="#2563EB" />
        </div>
        <div className={cn(CARD, 'p-5')}>
          <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Kunlik faol foydalanuvchilar (14 kun)</h2>
          <TrendChart data={data.dailyActive} color="#60A5FA" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={cn(CARD, 'p-5')}>
          <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Darslar bo&apos;yicha yakunlanishlar</h2>
          {data.completion.length === 0
            ? <EmptyState icon={BarChart3} title="Hali ma'lumot yo'q" subtitle="Darslar yakunlangach statistika shu yerda chiqadi" />
            : <RankBarChart data={data.completion} color="#2563EB" domainMax={Math.max(data.totalUsers, 1)} />}
        </div>

        <div className={cn(CARD, 'overflow-hidden')}>
          <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <Trophy className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Eng ko&apos;p qadam bosgan foydalanuvchilar</h2>
          </div>
          {data.top.length === 0 ? (
            <EmptyState icon={Trophy} title="Hali ma'lumot yo'q" subtitle="Foydalanuvchilar dars yakunlagach reyting shu yerda chiqadi" />
          ) : (
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {data.top.map((u) => (
                <div key={u.rank} className={LIST_ROW}>
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    {u.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{u.name}</p>
                    <p className="truncate text-xs text-slate-400 dark:text-slate-500">{u.email}</p>
                  </div>
                  <span className="font-mono text-sm font-extrabold text-amber-500">{u.qadam} qadam</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
