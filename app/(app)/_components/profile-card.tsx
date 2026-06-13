'use client'

import { useEffect, useState } from 'react'
import { Star, User, ListChecks, Zap, Flame, ArrowUpRight, CalendarDays, ShieldCheck } from 'lucide-react'

interface Stats { totalTests: number; bestWpm: number | null; streak: number }
interface Profile { name: string; email: string; image: string | null; createdAt: string; stats: Stats }

const REFRESH_MS = 10_000

const MONTHS_UZ = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
]

function formatJoined(date: string) {
  const d = new Date(date)
  return `${MONTHS_UZ[d.getMonth()]} ${d.getFullYear()}`
}

export function ProfileCard({ initial }: { initial: Profile }) {
  const [profile, setProfile] = useState(initial)

  useEffect(() => {
    let cancelled = false

    async function refresh() {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setProfile(data)
      } catch {
        // keep showing last known data on transient network errors
      }
    }

    const id = setInterval(refresh, REFRESH_MS)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  const initials = (profile.name[0] ?? '').toUpperCase()

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      {/* Identity row */}
      <div className="flex items-center gap-3.5">
        {profile.image ? (
          <img src={profile.image} alt={profile.name} referrerPolicy="no-referrer"
            className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
        ) : (
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-sans text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">{profile.name}</p>
          <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">{profile.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 ring-1 ring-inset ring-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-900/40">
              <Star className="h-2.5 w-2.5 fill-blue-500 text-blue-500" />
              Yangi boshlovchi
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 ring-1 ring-inset ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-900/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Faol
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-slate-100 dark:bg-slate-800" />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50">
            <ListChecks className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="font-mono text-base font-bold text-slate-900 dark:text-white">{profile.stats.totalTests}</div>
            <div className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Darslar</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950/50">
            <Zap className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="font-mono text-base font-bold text-slate-900 dark:text-white">{profile.stats.bestWpm ?? '—'}</div>
            <div className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">WPM</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/50">
            <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="font-mono text-base font-bold text-slate-900 dark:text-white">{profile.stats.streak}</div>
            <div className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Kun</div>
          </div>
        </div>
      </div>

      {/* Account details */}
      <div className="mt-4 space-y-2 rounded-xl border border-slate-100 px-3.5 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2.5 text-xs">
          <CalendarDays className="h-3.5 w-3.5 flex-shrink-0 text-slate-300 dark:text-slate-600" />
          <span className="text-slate-400 dark:text-slate-500">A&apos;zo bo&apos;lgan</span>
          <span className="ml-auto font-semibold text-slate-600 dark:text-slate-300">{formatJoined(profile.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
          <span className="text-slate-400 dark:text-slate-500">Hisob holati</span>
          <span className="ml-auto font-semibold text-emerald-600 dark:text-emerald-400">Faollashtirilgan</span>
        </div>
      </div>

      {/* CTA */}
      <a href="/settings"
        className="group mt-auto flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
        <span className="flex items-center gap-2">
          <User className="h-3.5 w-3.5" />
          Sozlamalarga o&apos;tish
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-500" />
      </a>
    </div>
  )
}
