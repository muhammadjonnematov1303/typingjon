import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { getQadamRanking } from '@/lib/ranking'
import { Trophy, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AutoRefresh } from '@/components/auto-refresh'

type Range = 'all' | 'weekly' | 'monthly'

async function getUser() {
  const userId = await getSession()
  if (!userId) redirect('/login')
  const db = getDb()
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) redirect('/login')
  return user
}

function rangeStart(range: Range): Date | undefined {
  const now = new Date()
  if (range === 'weekly')  { const d = new Date(now); d.setDate(d.getDate() - 7);  return d }
  if (range === 'monthly') { const d = new Date(now); d.setDate(d.getDate() - 30); return d }
  return undefined
}

async function getLeaderboard(range: Range, meId: string) {
  const ranked = await getQadamRanking(rangeStart(range))
  const board  = ranked.map(e => ({ ...e, handle: e.email.split('@')[0] }))

  const mine    = board.find(e => e.userId === meId)
  const myQadam = mine?.qadam ?? 0
  const myRank  = mine?.rank ?? null

  return { board, myQadam, myRank }
}

function Avatar({ name, image, size = 'md' }: { name: string; image: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'h-16 w-16 text-lg' : size === 'md' ? 'h-11 w-11 text-sm' : 'h-9 w-9 text-xs'
  return image ? (
    <img src={image} alt={name} referrerPolicy="no-referrer"
      className={cn('flex-shrink-0 rounded-full object-cover ring-2 ring-blue-100', sz)} />
  ) : (
    <div className={cn('flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white ring-2 ring-blue-100', sz)}>
      {(name[0] ?? '').toUpperCase()}
    </div>
  )
}

const RANK_MEDAL: Record<number, string> = {
  1: 'bg-amber-400 text-white shadow-md shadow-amber-200',
  2: 'bg-slate-300 text-white shadow-md shadow-slate-100',
  3: 'bg-orange-300 text-white shadow-md shadow-orange-100',
}

// Tilla (gold) · Kumush (silver) · Bronza (bronze) theming for the podium cards
const RANK_THEME: Record<number, { card: string; strip: string; num: string; label: string }> = {
  1: { card: 'border-amber-300 bg-gradient-to-b from-amber-50 to-white shadow-lg shadow-amber-200/50 dark:border-amber-700/60 dark:from-amber-950/30 dark:to-slate-900 dark:shadow-amber-900/20',  strip: 'bg-gradient-to-r from-amber-400 to-yellow-500',  num: 'text-amber-600 dark:text-amber-400',  label: 'Tilla'  },
  2: { card: 'border-slate-300 bg-gradient-to-b from-slate-50 to-white shadow-md shadow-slate-200/50 dark:border-slate-600/60 dark:from-slate-800/50 dark:to-slate-900',  strip: 'bg-gradient-to-r from-slate-300 to-slate-400',   num: 'text-slate-500 dark:text-slate-300',  label: 'Kumush' },
  3: { card: 'border-orange-300 bg-gradient-to-b from-orange-50 to-white shadow-md shadow-orange-200/50 dark:border-orange-800/60 dark:from-orange-950/30 dark:to-slate-900', strip: 'bg-gradient-to-r from-orange-400 to-amber-600', num: 'text-orange-600 dark:text-orange-400', label: 'Bronza' },
}

const RANGE_LABELS: Record<Range, string> = { all: 'Barcha vaqt', weekly: 'Haftalik', monthly: 'Oylik' }

interface PageProps { searchParams: Promise<{ range?: string }> }

export default async function LeaderboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const range  = (['weekly', 'monthly'].includes(params.range ?? '') ? params.range as Range : 'all')

  const me = await getUser()
  const { board, myQadam, myRank } = await getLeaderboard(range, me.id)

  // Mobile shows 1·2·3 in natural order; sm+ reorders into a 2·1·3 podium via CSS
  const podium = [board[0], board[1], board[2]].filter(Boolean)
  const rest   = board.slice(3)

  return (
    <div className="space-y-5 p-6">
      <AutoRefresh />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Trophy className="h-5 w-5 text-amber-500" />
            Reyting
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500">Bosib o&apos;tilgan qadamlar bo&apos;yicha global jadval</p>
        </div>
        {/* Range tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {(['all', 'weekly', 'monthly'] as Range[]).map(r => (
            <a key={r} href={r === 'all' ? '/leaderboard' : `/leaderboard?range=${r}`}
              className={cn(
                'rounded-lg px-4 py-1.5 text-xs font-bold transition-all',
                range === r ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800',
              )}>
              {RANGE_LABELS[r]}
            </a>
          ))}
        </div>
      </div>

      {/* My ranking banner */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-3.5 ring-1 ring-blue-100 dark:border-blue-900/40 dark:bg-blue-950/30 dark:ring-blue-900/40">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/50">
            <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Sizning qadamingiz</p>
            <p className="font-mono text-lg font-extrabold text-blue-700 dark:text-blue-300">{myQadam} qadam</p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-blue-600 ring-1 ring-blue-100 dark:bg-slate-800 dark:text-blue-400 dark:ring-blue-900/40">
          {myRank ? `#${myRank} o'rin` : "Reytingda yo'q"}
        </span>
      </div>

      {board.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Trophy className="h-7 w-7 text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {range === 'all' ? "Reyting hali bo'sh" : "Bu davrda natijalar yo'q"}
          </p>
          <p className="max-w-xs text-xs text-slate-400 dark:text-slate-500">
            Darslarni bajaring va reytingga kiring
          </p>
          <a href="/lessons"
            className="mt-1 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-blue-700">
            Darslarni boshlash
          </a>
        </div>
      ) : (
        <>
          {/* ── Podium ── */}
          {podium.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-3">
              {podium.map(entry => {
                const isFirst = entry.rank === 1
                const theme   = RANK_THEME[entry.rank] ?? RANK_THEME[3]
                return (
                  <div key={entry.rank}
                    className={cn(
                      'relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border-2 p-6 text-center transition-all duration-300',
                      theme.card,
                      entry.rank === 1 ? 'sm:order-2' : entry.rank === 2 ? 'sm:order-1' : 'sm:order-3',
                      isFirst && 'sm:-translate-y-3',
                    )}>
                    {/* Accent strip */}
                    <div className={cn('absolute inset-x-0 top-0 h-1.5 rounded-t-2xl', theme.strip)} />

                    {/* Rank medal */}
                    <span className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-extrabold',
                      RANK_MEDAL[entry.rank] ?? 'bg-slate-100 text-slate-400',
                    )}>
                      {entry.rank}
                    </span>

                    <Avatar name={entry.name} image={entry.image} size="lg" />

                    <div className="min-w-0 w-full">
                      <p className="flex items-center justify-center gap-1.5 text-sm font-extrabold text-slate-900 dark:text-white">
                        <span className="truncate">{entry.name}</span>
                        {entry.userId === me.id && (
                          <span className="flex-shrink-0 rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-600 ring-1 ring-blue-200">Siz</span>
                        )}
                      </p>
                      <p className="truncate text-xs text-slate-400 dark:text-slate-500">@{entry.handle}</p>
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                      <span className={cn('font-mono text-3xl font-extrabold tabular-nums', theme.num)}>{entry.qadam}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">QADAM</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Rest of list ── */}
          {rest.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* Table header */}
              <div className="grid grid-cols-[2.5rem_1fr_5rem] items-center gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-2.5 dark:border-slate-800 dark:bg-slate-800/40">
                {['#', 'Foydalanuvchi', 'Qadam'].map(h => (
                  <span key={h} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 last:text-right dark:text-slate-500">{h}</span>
                ))}
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-800/70">
                {rest.map(entry => {
                  const isSelf = entry.userId === me.id
                  return (
                    <div key={entry.rank}
                      className={cn(
                        'grid grid-cols-[2.5rem_1fr_5rem] items-center gap-4 px-5 py-3.5 transition-colors',
                        isSelf ? 'bg-blue-50/60 hover:opacity-90 dark:bg-blue-950/30' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/30',
                      )}>
                      {/* Rank */}
                      <span className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold',
                        isSelf ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                      )}>
                        {entry.rank}
                      </span>

                      {/* User */}
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={entry.name} image={entry.image} size="sm" />
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                            <span className="truncate">{entry.name}</span>
                            {isSelf && (
                              <span className="flex-shrink-0 rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-600 ring-1 ring-blue-200 dark:ring-blue-900/50">
                                Siz
                              </span>
                            )}
                          </p>
                          <p className="truncate text-xs text-slate-400 dark:text-slate-500">@{entry.handle}</p>
                        </div>
                      </div>

                      {/* Qadam score */}
                      <div className="text-right font-mono text-sm font-extrabold tabular-nums text-blue-600 dark:text-blue-400">
                        {entry.qadam}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
