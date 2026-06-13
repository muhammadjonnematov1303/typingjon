import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { getLessons } from '@/lib/lessons'
import { getUserStats } from '@/lib/user-stats'
import { Zap, Target, Flame, Trophy, BarChart2, TrendingUp, Clock } from 'lucide-react'

async function getUser() {
  const userId = await getSession()
  if (!userId) redirect('/login')
  const db = getDb()
  const user = await db.user.findUnique({
    where:  { id: userId },
    select: { id: true, name: true, email: true, image: true, createdAt: true },
  })
  if (!user) redirect('/login')
  return user
}

async function getFullStats(userId: string) {
  const db = getDb()
  const [s, history] = await Promise.all([
    getUserStats(userId),
    db.lessonProgress.findMany({
      where:   { userId, completed: true },
      orderBy: { completedAt: 'desc' },
    }),
  ])

  return {
    totalLessons: s.completedLessons,
    bestWpm:      s.bestWpm      || null,
    avgWpm:       s.avgWpm       || null,
    avgAccuracy:  s.avgAccuracy  || null,
    bestAccuracy: s.bestAccuracy || null,
    streak:       s.streak,
    history,
  }
}

function timeAgo(date: Date | string) {
  const diff  = Date.now() - new Date(date).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins < 1)   return 'Hozir'
  if (mins < 60)  return `${mins} daqiqa oldin`
  if (hours < 24) return `${hours} soat oldin`
  return `${days} kun oldin`
}

function wpmColor(wpm: number) {
  if (wpm >= 80) return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
  if (wpm >= 60) return 'bg-blue-50 text-blue-700 ring-blue-100'
  if (wpm >= 40) return 'bg-amber-50 text-amber-700 ring-amber-100'
  return 'bg-slate-100 text-slate-600 ring-slate-200'
}

function accColor(acc: number) {
  if (acc >= 98) return 'text-emerald-600'
  if (acc >= 90) return 'text-blue-600'
  if (acc >= 80) return 'text-amber-600'
  return 'text-slate-500'
}

export default async function StatsPage() {
  const user  = await getUser()
  const [stats, lessons] = await Promise.all([
    getFullStats(user.id), getLessons(),
  ])
  const lessonTitles = new Map(lessons.map(l => [l.id, l.title]))

  const summaryCards = [
    { icon: Zap,        label: 'Eng yaxshi WPM',      value: stats.bestWpm      ? `${stats.bestWpm}`       : '—', color: 'text-blue-600',    bg: 'bg-blue-50',    ring: 'ring-blue-100',    grad: 'from-blue-400 to-blue-600'     },
    { icon: TrendingUp, label: "O'rtacha WPM",        value: stats.avgWpm       ? `${stats.avgWpm}`        : '—', color: 'text-indigo-600',  bg: 'bg-indigo-50',  ring: 'ring-indigo-100',  grad: 'from-indigo-400 to-indigo-600' },
    { icon: Target,     label: "O'rtacha aniqlik",    value: stats.avgAccuracy  ? `${stats.avgAccuracy}%`  : '—', color: 'text-violet-600',  bg: 'bg-violet-50',  ring: 'ring-violet-100',  grad: 'from-violet-400 to-violet-600' },
    { icon: Trophy,     label: 'Eng yaxshi aniqlik',  value: stats.bestAccuracy ? `${stats.bestAccuracy}%` : '—', color: 'text-amber-500',   bg: 'bg-amber-50',   ring: 'ring-amber-100',   grad: 'from-amber-400 to-amber-600'   },
    { icon: Flame,      label: 'Streak',              value: `${stats.streak}`,       color: 'text-orange-500',  bg: 'bg-orange-50',  ring: 'ring-orange-100',  grad: 'from-orange-400 to-orange-600' },
    { icon: BarChart2,  label: 'Yakunlangan darslar', value: `${stats.totalLessons}`, color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-100', grad: 'from-emerald-400 to-emerald-600' },
  ]

  const initials = (user.name[0] ?? '').toUpperCase()

  return (
    <div className="space-y-6 p-6">

      {/* Header — profile + step summary */}
      <div className="flex flex-wrap items-center gap-4">
        {user.image
          ? <img src={user.image} alt="" referrerPolicy="no-referrer" className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover ring-2 ring-blue-100" />
          : <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white ring-2 ring-blue-100">{initials}</div>}
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <BarChart2 className="h-5 w-5 text-blue-600" />
            Statistika
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500">{user.name} · Darslar bo&apos;yicha yutuqlaringiz</p>
        </div>
        <div className="ml-auto flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-2.5 dark:border-blue-900/40 dark:bg-blue-950/30">
          <Trophy className="h-4 w-4 text-blue-500" />
          <div>
            <div className="font-mono text-lg font-extrabold leading-none text-blue-700 dark:text-blue-300">{stats.totalLessons}</div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-400">qadam</div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {summaryCards.map(({ icon: Icon, label, value, color, bg, ring, grad }) => (
          <div key={label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${grad}`} />
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${bg} ${ring} dark:bg-slate-800 dark:ring-slate-700`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="font-mono text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{value}</div>
            <div className="mt-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* History table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Darslar tarixi</h2>
          </div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {stats.totalLessons > 0 ? `${stats.totalLessons} ta dars` : "Hali dars yakunlanmagan"}
          </span>
        </div>

        {stats.history.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <BarChart2 className="h-7 w-7 text-slate-300 dark:text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Natijalar yo&apos;q</p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Darslarni yakunlang va natijalaringiz bu yerda ko&apos;rinadi</p>
            </div>
            <a href="/lessons"
              className="mt-1 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700">
              Darslarni boshlash
            </a>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-[3rem_1fr_5rem_5rem_7rem] gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-2.5 dark:border-slate-800 dark:bg-slate-800/40">
              {['#', 'Dars', 'WPM', 'Aniqlik', 'Vaqt'].map((h, i) => (
                <span key={h} className={`text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${i >= 2 && i <= 3 ? 'text-center' : ''} ${i === 4 ? 'text-right' : ''}`}>{h}</span>
              ))}
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800/70">
              {stats.history.map((r, idx) => (
                <div key={r.id} className="grid grid-cols-[3rem_1fr_5rem_5rem_7rem] items-center gap-4 px-6 py-3.5 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 font-mono text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">{idx + 1}</span>
                  <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{lessonTitles.get(r.lessonId) ?? r.lessonId}</span>
                  <span className={`mx-auto inline-flex w-fit items-center rounded-lg px-2.5 py-1 font-mono text-sm font-bold ring-1 ${wpmColor(r.bestWpm ?? 0)}`}>
                    {r.bestWpm ?? '—'}
                  </span>
                  <span className={`text-center font-mono text-sm font-bold tabular-nums ${r.bestAccuracy != null ? accColor(Math.round(r.bestAccuracy)) : 'text-slate-400'}`}>
                    {r.bestAccuracy != null ? `${Math.round(r.bestAccuracy)}%` : '—'}
                  </span>
                  <span className="text-right text-xs font-medium text-slate-400">{r.completedAt ? timeAgo(r.completedAt) : '—'}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
