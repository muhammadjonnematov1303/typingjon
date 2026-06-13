import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { getUserStats } from '@/lib/user-stats'
import {
  Keyboard, Zap, Target, Flame, Trophy,
  BarChart2, TrendingUp, BookOpen,
  ChevronRight, Activity, Star,
} from 'lucide-react'
import { ProfileCard } from '../_components/profile-card'

async function getUser() {
  const userId = await getSession()
  if (!userId) redirect('/login')
  const db = getDb()
  const user = await db.user.findUnique({
    where:  { id: userId },
    select: {
      id: true, name: true, email: true, image: true,
      createdAt: true,
      role: true, banned: true,
    },
  })
  if (!user) redirect('/login')
  return user
}

export default async function DashboardPage() {
  const user      = await getUser()
  const s         = await getUserStats(user.id)
  const stats     = {
    totalTests:  s.completedLessons,
    bestWpm:     s.bestWpm || null,
    avgAccuracy: s.avgAccuracy || null,
    streak:      s.streak,
  }
  const firstName = user.name.split(' ')[0]

  const statCards = [
    {
      icon: Zap, label: 'Eng yaxshi WPM',
      value: stats.bestWpm     ? `${stats.bestWpm}`     : '—',
      sub:   stats.totalTests  ? `${stats.totalTests} darsdan` : "Hali dars yakunlanmagan",
      color: 'text-blue-600', bg: 'bg-blue-50', accent: 'bg-blue-500',
    },
    {
      icon: Target, label: "O'rtacha aniqlik",
      value: stats.avgAccuracy ? `${stats.avgAccuracy}%` : '—',
      sub:   'barcha darslar o\'rtachasi',
      color: 'text-violet-600', bg: 'bg-violet-50', accent: 'bg-violet-500',
    },
    {
      icon: Flame, label: 'Streak',
      value: `${stats.streak}`,
      sub:   'ketma-ket kun',
      color: 'text-orange-500', bg: 'bg-orange-50', accent: 'bg-orange-500',
    },
    {
      icon: Trophy, label: 'Yakunlangan darslar',
      value: `${stats.totalTests}`,
      sub:   'yakunlangan dars',
      color: 'text-amber-500', bg: 'bg-amber-50', accent: 'bg-amber-500',
    },
  ]

  const quickActions = [
    { icon: Keyboard,   label: 'Yozish testi', desc: "Erkin mashq qiling",          href: '/test',        color: 'text-blue-600',    bg: 'bg-blue-50',    accent: 'bg-blue-500',    primary: true  },
    { icon: BookOpen,   label: 'Darslar',      desc: "Bosqichma-bosqich o'rganing", href: '/lessons',     color: 'text-emerald-600', bg: 'bg-emerald-50', accent: 'bg-emerald-500', primary: false },
    { icon: BarChart2,  label: 'Statistika',   desc: "Taraqqiyotingizni ko'ring",   href: '/stats',       color: 'text-violet-600',  bg: 'bg-violet-50',  accent: 'bg-violet-500',  primary: false },
    { icon: TrendingUp, label: 'Reyting',      desc: "Global o'rinlar jadvali",     href: '/leaderboard', color: 'text-amber-500',   bg: 'bg-amber-50',   accent: 'bg-amber-500',   primary: false },
  ]

  return (
    <div className="space-y-5 p-6">

      {/* ── Welcome banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-7 shadow-xl shadow-blue-500/20 ring-1 ring-white/10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_55%)]" />

        <div className="relative flex items-center justify-between gap-8">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80 ring-1 ring-white/15 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Onlayn
            </span>

            <h1 className="mt-3.5 text-[28px] font-extrabold leading-tight tracking-tight text-white">
              Salom, {firstName}
              <span className="text-blue-200">.</span>
            </h1>
            <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-blue-100/60">
              {stats.totalTests > 0
                ? `Jami ${stats.totalTests} ta dars yakunladingiz. Shaxsiy rekordingiz — ${stats.bestWpm} WPM.`
                : "Birinchi darsingizni boshlang va natijalaringizni kuzatib boring."}
            </p>

            {/* Quick stats pills — only when data exists */}
            {stats.totalTests > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/10 backdrop-blur-sm">
                  <Zap className="h-3 w-3 text-amber-300" />
                  {stats.bestWpm}
                  <span className="font-medium text-white/50">WPM rekord</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/10 backdrop-blur-sm">
                  <Flame className="h-3 w-3 text-orange-300" />
                  {stats.streak}
                  <span className="font-medium text-white/50">kun ketma-ket</span>
                </span>
              </div>
            )}

            <a href="/test"
              className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 shadow-lg shadow-black/10 transition-all hover:shadow-xl hover:shadow-black/20 active:scale-[0.98]">
              <Keyboard className="h-4 w-4" />
              Testni boshlash
              <ChevronRight className="h-4 w-4 text-blue-400 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="hidden flex-shrink-0 sm:block">
            <div className="relative flex h-[88px] w-[88px] items-center justify-center rounded-[28px] border border-white/15 bg-white/[0.07] shadow-inner backdrop-blur-md">
              <div className="absolute inset-2 rounded-[22px] border border-white/10" />
              <Keyboard className="h-9 w-9 text-white/70" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ icon: Icon, label, value, sub, color, bg, accent }) => (
          <div key={label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className={`absolute right-0 top-0 h-1 w-full rounded-t-2xl ${accent} opacity-60`} />
            <div className="flex items-start justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg} dark:bg-slate-800`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </div>
            <div className="mt-4 font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</div>
            <div className="mt-0.5 text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500">{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Quick actions + Profile card ── */}
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
        <Activity className="h-3.5 w-3.5" />
        Tezkor harakatlar
      </h2>
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Quick actions */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 lg:col-span-2">
            {quickActions.map(({ icon: Icon, label, desc, href, color, bg, accent, primary }) => (
              <a key={label} href={href}
                className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">

                <div className={`absolute inset-x-0 top-0 h-1 ${accent} opacity-60`} />

                {primary && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-500 ring-1 ring-blue-100 dark:bg-blue-950/40 dark:ring-blue-900/40">
                    <Star className="h-2.5 w-2.5 fill-blue-500" />
                    Tavsiya
                  </span>
                )}

                <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${bg} dark:bg-slate-800`}>
                  <Icon className={`h-[18px] w-[18px] ${color}`} />
                </div>

                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">{label}</div>
                    <div className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">{desc}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" />
                </div>
              </a>
            ))}
        </div>

        <ProfileCard initial={{
          name:      user.name,
          email:     user.email,
          image:     user.image ?? null,
          createdAt: user.createdAt.toISOString(),
          stats:     { totalTests: stats.totalTests, bestWpm: stats.bestWpm, streak: stats.streak },
        }} />
      </div>

    </div>
  )
}
