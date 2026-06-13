import { getQadamRanking } from '@/lib/ranking'
import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmptyState } from '../_components/empty-state'
import { CARD, TAB_BAR, tabClass, PAGE_TITLE, PAGE_SUBTITLE } from '../_lib/ui'
import { AutoRefresh } from '@/components/auto-refresh'

type Range = 'global' | 'weekly' | 'monthly'

const TABS: { key: Range; label: string }[] = [
  { key: 'global',  label: 'Global' },
  { key: 'weekly',  label: 'Haftalik' },
  { key: 'monthly', label: 'Oylik' },
]

const RANK_MEDAL: Record<number, string> = {
  1: 'bg-amber-400 text-white',
  2: 'bg-slate-300 text-white',
  3: 'bg-orange-300 text-white',
}

// Tilla · Kumush · Bronza theming for the podium (mirrors the user leaderboard)
const RANK_THEME: Record<number, { card: string; strip: string; num: string }> = {
  1: { card: 'border-amber-300 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-900',  strip: 'bg-gradient-to-r from-amber-400 to-yellow-500',  num: 'text-amber-600 dark:text-amber-400' },
  2: { card: 'border-slate-300 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900',  strip: 'bg-gradient-to-r from-slate-300 to-slate-400',   num: 'text-slate-500 dark:text-slate-300' },
  3: { card: 'border-orange-300 bg-gradient-to-b from-orange-50 to-white dark:from-orange-950/30 dark:to-slate-900', strip: 'bg-gradient-to-r from-orange-400 to-amber-600', num: 'text-orange-600 dark:text-orange-400' },
}

function initialsOf(name: string) {
  return (name[0] ?? '').toUpperCase()
}

function rangeStart(range: Range): Date | undefined {
  const now = new Date()
  if (range === 'weekly') {
    const d = new Date(now)
    const day = (d.getDay() + 6) % 7 // Monday = 0
    d.setDate(d.getDate() - day)
    d.setHours(0, 0, 0, 0)
    return d
  }
  if (range === 'monthly') {
    return new Date(now.getFullYear(), now.getMonth(), 1)
  }
  return undefined
}

async function getLeaderboard(range: Range) {
  return getQadamRanking(rangeStart(range))
}

export default async function AdminLeaderboardPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range: rawRange } = await searchParams
  const range: Range = rawRange === 'weekly' || rawRange === 'monthly' ? rawRange : 'global'
  const board = await getLeaderboard(range)

  const podium = [board[0], board[1], board[2]].filter(Boolean)
  const rest   = board.slice(3)

  return (
    <div className="space-y-4 p-6">
      <AutoRefresh />
      <div>
        <h1 className={PAGE_TITLE}>
          <Trophy className="h-5 w-5 text-amber-500" />
          Reyting
        </h1>
        <p className={PAGE_SUBTITLE}>Bosib o&apos;tilgan qadamlar bo&apos;yicha</p>
      </div>

      {/* Tabs */}
      <div className={TAB_BAR}>
        {TABS.map(t => (
          <a key={t.key} href={t.key === 'global' ? '/admin/leaderboard' : `/admin/leaderboard?range=${t.key}`}
            className={tabClass(range === t.key)}>
            {t.label}
          </a>
        ))}
      </div>

      {board.length === 0 ? (
        <div className={cn(CARD, 'overflow-hidden')}>
          <EmptyState icon={Trophy} title="Reyting hali bo'sh" subtitle="Bu davr uchun ma'lumot topilmadi" />
        </div>
      ) : (
        <>
          {/* Podium */}
          {podium.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-3">
              {podium.map(entry => {
                const theme = RANK_THEME[entry.rank] ?? RANK_THEME[3]
                return (
                  <div key={entry.rank}
                    className={cn(
                      'relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border-2 p-6 text-center',
                      theme.card,
                      entry.rank === 1 ? 'sm:order-2 sm:-translate-y-2' : entry.rank === 2 ? 'sm:order-1' : 'sm:order-3',
                    )}>
                    <div className={cn('absolute inset-x-0 top-0 h-1.5 rounded-t-2xl', theme.strip)} />
                    <span className={cn('flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-extrabold', RANK_MEDAL[entry.rank])}>
                      {entry.rank}
                    </span>
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white ring-2 ring-white dark:ring-slate-800">
                      {entry.image ? <img src={entry.image} alt="" className="h-full w-full object-cover" /> : initialsOf(entry.name)}
                    </div>
                    <div className="min-w-0 w-full">
                      <p className="truncate text-sm font-extrabold text-slate-900 dark:text-white">{entry.name}</p>
                      <p className="truncate text-xs text-slate-400 dark:text-slate-500">{entry.email}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn('font-mono text-3xl font-extrabold tabular-nums', theme.num)}>{entry.qadam}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">QADAM</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Rest of the list */}
          {rest.length > 0 && (
            <div className={cn(CARD, 'overflow-hidden')}>
              <div className="overflow-x-auto">
                <div className="min-w-[420px] divide-y divide-slate-50 dark:divide-slate-800">
                  {rest.map(entry => (
                    <div key={entry.rank} className="grid grid-cols-[2.5rem_1fr_5rem] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 font-mono text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {entry.rank}
                      </span>
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-bold text-white">
                          {entry.image ? <img src={entry.image} alt="" className="h-full w-full object-cover" /> : initialsOf(entry.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{entry.name}</p>
                          <p className="truncate text-xs text-slate-400 dark:text-slate-500">{entry.email}</p>
                        </div>
                      </div>
                      <div className="text-right font-mono text-sm font-extrabold tabular-nums text-blue-600 dark:text-blue-400">
                        {entry.qadam}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
