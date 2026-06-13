import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { getUserStats } from '@/lib/user-stats'
import { cn } from '@/lib/utils'
import { Calendar, Settings, Zap, Target, Clock, Keyboard, BookOpen } from 'lucide-react'

function formatDuration(totalSec: number) {
  if (totalSec < 60) return `${totalSec}s`
  const mins = Math.round(totalSec / 60)
  if (mins < 60) return `${mins} daqiqa`
  return `${Math.floor(mins / 60)}s ${mins % 60}d`
}

export default async function ProfilePage() {
  const userId = await getSession()
  if (!userId) redirect('/login')

  const db   = getDb()
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) redirect('/login')

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const [s, todayByType] = await Promise.all([
    getUserStats(userId),
    db.result.groupBy({
      by: ['type'],
      where: { userId, createdAt: { gte: startOfDay } },
      _sum: { duration: true },
    }),
  ])

  const totalTests       = s.totalSessions
  const completedLessons = s.completedLessons
  const bestWpm          = s.bestWpm
  const avgAccuracy      = s.avgAccuracy
  const totalMins        = Math.round(s.totalDurationSec / 60)
  const initials         = (user.name[0] ?? '').toUpperCase()

  const testSecToday   = todayByType.find(r => r.type === 'test')?._sum.duration   ?? 0
  const lessonSecToday = todayByType.find(r => r.type === 'lesson')?._sum.duration ?? 0
  const totalSecToday  = testSecToday + lessonSecToday
  const testPct        = totalSecToday > 0 ? Math.round((testSecToday / totalSecToday) * 100) : 0

  const joinedDate = new Date(user.createdAt).toLocaleDateString('uz-UZ', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const stats = [
    { label: "Darslar",          value: completedLessons, icon: BookOpen,  color: 'text-blue-600',    bg: 'bg-blue-50',    accent: 'bg-blue-500'    },
    { label: "Eng yuqori WPM",   value: bestWpm,           icon: Zap,       color: 'text-violet-600',  bg: 'bg-violet-50',  accent: 'bg-violet-500'  },
    { label: "O'rtacha aniqlik", value: `${avgAccuracy}%`, icon: Target,    color: 'text-emerald-600', bg: 'bg-emerald-50', accent: 'bg-emerald-500' },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-6">

      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-7 shadow-xl shadow-blue-500/20 ring-1 ring-white/10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_55%)]" />

        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10 text-2xl font-extrabold text-white ring-2 ring-white/20 backdrop-blur-sm">
            {user.image
              ? <img src={user.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              : initials}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-extrabold tracking-tight text-white">{user.name}</h1>
            <p className="mt-0.5 truncate text-sm text-blue-100/70">{user.email}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80 ring-1 ring-white/15 backdrop-blur-sm">
              <Calendar className="h-3 w-3" />
              {joinedDate}
            </span>
          </div>

          <a href="/settings"
            className="flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur-sm transition-colors hover:bg-white/20">
            <Settings className="h-3.5 w-3.5" />
            Tahrirlash
          </a>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color, bg, accent }) => (
          <div key={label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900">
            <div className={cn('absolute inset-x-0 top-0 h-1 opacity-60', accent)} />
            <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', bg, 'dark:bg-slate-800')}>
              <Icon className={cn('h-4 w-4', color)} />
            </div>
            <p className="mt-3 font-mono text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Today's activity */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          <Clock className="h-4 w-4 text-blue-500" />
          Bugungi faollik
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-500/10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
              <Keyboard className="h-3.5 w-3.5" />
              Yozish testi
            </div>
            <p className="mt-2 font-mono text-xl font-extrabold text-slate-900 dark:text-white">{formatDuration(testSecToday)}</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <BookOpen className="h-3.5 w-3.5" />
              Darslar
            </div>
            <p className="mt-2 font-mono text-xl font-extrabold text-slate-900 dark:text-white">{formatDuration(lessonSecToday)}</p>
          </div>
        </div>

        {totalSecToday > 0 ? (
          <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="bg-blue-500" style={{ width: `${testPct}%` }} />
            <div className="bg-emerald-500" style={{ width: `${100 - testPct}%` }} />
          </div>
        ) : (
          <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">Bugun hali mashq qilinmagan</p>
        )}
      </div>

      {/* Total practice time */}
      {totalMins > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Jami mashq vaqti</span>
          <span className="font-mono text-lg font-extrabold text-blue-600 dark:text-blue-400">
            {totalMins >= 60
              ? `${Math.floor(totalMins / 60)}s ${totalMins % 60}d`
              : `${totalMins} daqiqa`}
          </span>
        </div>
      )}

      {/* CTA */}
      {totalTests === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Hali birorta test bajarilmagan</p>
          <a href="/test"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700">
            Birinchi testni boshlash
          </a>
        </div>
      )}
    </div>
  )
}
