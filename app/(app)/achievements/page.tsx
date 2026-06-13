import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { cn } from '@/lib/utils'
import {
  Trophy, Zap, Target, Star, BookOpen, Award, Flame, Crown, Medal, Keyboard,
  CheckCircle2, Lock, type LucideIcon,
} from 'lucide-react'

type Kind = 'lesson' | 'test' | 'wpm' | 'acc' | 'streak'

interface Stats {
  lessonsCompleted: number
  totalTests: number
  bestWpm: number
  bestAccuracy: number
  streak: number
}

interface Def { name: string; kind: Kind; n: number; gold?: boolean; Icon?: LucideIcon }

// 100 uniquely-named achievements. Most track lesson "qadam"; some require other
// tasks — tests done, WPM reached, accuracy, daily streak.
const DEFS: Def[] = [
  { name: 'Birinchi qadam',        kind: 'lesson', n: 1,   gold: true, Icon: Trophy },
  { name: "Uyg'onish",             kind: 'lesson', n: 2 },
  { name: 'Ilk uchqun',            kind: 'lesson', n: 3 },
  { name: 'Ilk sinov',             kind: 'test',   n: 1 },
  { name: 'Beshlik',               kind: 'lesson', n: 5,   gold: true, Icon: Star },
  { name: 'Barmoqlar raqsi',       kind: 'lesson', n: 6 },
  { name: 'Tetiklik',              kind: 'lesson', n: 7 },
  { name: 'Chaqqon',               kind: 'wpm',    n: 30 },
  { name: 'Sabr toshi',            kind: 'lesson', n: 8 },
  { name: "O'nlik",                kind: 'lesson', n: 10,  gold: true, Icon: Zap },
  { name: 'Izchillik',             kind: 'test',   n: 5 },
  { name: 'Ishonch',               kind: 'lesson', n: 12 },
  { name: 'Mardona',               kind: 'lesson', n: 14 },
  { name: 'Aniq nishon',           kind: 'acc',    n: 95 },
  { name: 'Sergaklik',             kind: 'lesson', n: 15 },
  { name: 'Shijoat',               kind: 'lesson', n: 17 },
  { name: 'Tezkor',                kind: 'wpm',    n: 40 },
  { name: 'Matonat',               kind: 'lesson', n: 18 },
  { name: 'Tinimsiz',              kind: 'lesson', n: 19 },
  { name: 'Yigirmalik',            kind: 'lesson', n: 20,  gold: true, Icon: Flame },
  { name: 'Kashshof',              kind: 'lesson', n: 22 },
  { name: 'Olovli kun',            kind: 'streak', n: 3 },
  { name: 'Epchil',                kind: 'lesson', n: 24 },
  { name: "Chorak yo'l",           kind: 'lesson', n: 25,  gold: true, Icon: Target },
  { name: "Qat'iyat",              kind: 'lesson', n: 26 },
  { name: 'Mukammal zarba',        kind: 'acc',    n: 100 },
  { name: 'Yuksalish',             kind: 'lesson', n: 28 },
  { name: 'Zarbdor',               kind: 'wpm',    n: 50 },
  { name: 'Mohirlik sari',         kind: 'lesson', n: 29 },
  { name: "O'ttizlik",             kind: 'lesson', n: 30,  gold: true, Icon: Award },
  { name: 'Charxpalak',            kind: 'lesson', n: 31 },
  { name: "O'n kunlik shijoat",    kind: 'test',   n: 10 },
  { name: 'Ildam',                 kind: 'lesson', n: 33 },
  { name: 'Mehnatkash',            kind: 'lesson', n: 35 },
  { name: 'Haftalik izchillik',    kind: 'streak', n: 7 },
  { name: 'Yuksak intilish',       kind: 'lesson', n: 37 },
  { name: "Sinovdan o'tgan",       kind: 'lesson', n: 38 },
  { name: 'Uchqur',                kind: 'wpm',    n: 60 },
  { name: 'Pishiq',                kind: 'lesson', n: 39 },
  { name: 'Qirqlik',               kind: 'lesson', n: 40,  gold: true, Icon: Award },
  { name: 'Ustalik shamoli',       kind: 'lesson', n: 42 },
  { name: 'Toblangan',             kind: 'lesson', n: 44 },
  { name: 'Egilmas',               kind: 'lesson', n: 45 },
  { name: 'Shiddat',               kind: 'lesson', n: 46 },
  { name: 'Zalvorli',              kind: 'lesson', n: 47 },
  { name: 'Yarim sari',            kind: 'lesson', n: 48 },
  { name: 'Yondosh',               kind: 'lesson', n: 49 },
  { name: "Yarim yo'l",            kind: 'lesson', n: 50,  gold: true, Icon: Medal },
  { name: 'Tajribakor',            kind: 'lesson', n: 51 },
  { name: 'Test sardori',          kind: 'test',   n: 25 },
  { name: 'Mustahkam',             kind: 'lesson', n: 52 },
  { name: "Kuch to'plagan",        kind: 'lesson', n: 53 },
  { name: 'Shamoldek tez',         kind: 'wpm',    n: 70 },
  { name: 'Dadil',                 kind: 'lesson', n: 54 },
  { name: "Oltin o'rta",           kind: 'lesson', n: 55,  gold: true, Icon: Star },
  { name: 'Sermahsul',             kind: 'lesson', n: 56 },
  { name: 'Charxlangan',           kind: 'lesson', n: 57 },
  { name: "Mukammal me'yor",       kind: 'acc',    n: 98 },
  { name: 'Mohir',                 kind: 'lesson', n: 59 },
  { name: 'Oltmishlik',            kind: 'lesson', n: 60,  gold: true, Icon: Award },
  { name: 'Zukko',                 kind: 'lesson', n: 61 },
  { name: 'Chiniqqan',             kind: 'lesson', n: 63 },
  { name: "Mag'rur",               kind: 'lesson', n: 64 },
  { name: "Olovli yo'l",           kind: 'streak', n: 14 },
  { name: 'Bardoshli ruh',         kind: 'lesson', n: 65 },
  { name: 'Yengilmas',             kind: 'lesson', n: 66 },
  { name: 'Shahdam',               kind: 'lesson', n: 67 },
  { name: "Bo'rondek",             kind: 'wpm',    n: 80 },
  { name: 'Mehnat zafari',         kind: 'lesson', n: 69 },
  { name: 'Yetmishlik',            kind: 'lesson', n: 70,  gold: true, Icon: Award },
  { name: 'Mahorat sari',          kind: 'lesson', n: 71 },
  { name: "Po'lat iroda",          kind: 'lesson', n: 72 },
  { name: 'Zabardast',             kind: 'lesson', n: 73 },
  { name: 'Yuz test cho\'qqisi',   kind: 'test',   n: 50 },
  { name: 'Uch chorak',            kind: 'lesson', n: 75,  gold: true, Icon: Crown },
  { name: 'Sarkarda',              kind: 'lesson', n: 76 },
  { name: "Ustoz yo'lida",         kind: 'lesson', n: 77 },
  { name: 'Olov yurak',            kind: 'lesson', n: 78 },
  { name: 'Yashin tezligi',        kind: 'wpm',    n: 90 },
  { name: 'Saksonlik',             kind: 'lesson', n: 80,  gold: true, Icon: Award },
  { name: 'Bilim sohibi',          kind: 'lesson', n: 81 },
  { name: 'Donishmand',            kind: 'lesson', n: 82 },
  { name: 'Mahir',                 kind: 'lesson', n: 83 },
  { name: 'Yulduzli',              kind: 'lesson', n: 84 },
  { name: "Cho'lpon",              kind: 'lesson', n: 85 },
  { name: 'Oydek porloq',          kind: 'acc',    n: 99 },
  { name: 'Zalvor',                kind: 'lesson', n: 87 },
  { name: 'Sarbaland',             kind: 'lesson', n: 88 },
  { name: 'Buyuk intilish',        kind: 'lesson', n: 89 },
  { name: "To'qsonlik",            kind: 'lesson', n: 90,  gold: true, Icon: Crown },
  { name: 'Afsona',                kind: 'lesson', n: 91 },
  { name: 'Oylik sadoqat',         kind: 'streak', n: 30 },
  { name: 'Daho yaqinida',         kind: 'lesson', n: 93 },
  { name: 'Yuz WPM samandari',     kind: 'wpm',    n: 100 },
  { name: 'Oltin qalam',           kind: 'lesson', n: 95,  gold: true, Icon: Star },
  { name: 'Mukammallik sari',      kind: 'lesson', n: 96 },
  { name: "Cho'qqi yaqinida",      kind: 'lesson', n: 98 },
  { name: 'Yuz testli jasorat',    kind: 'test',   n: 100 },
  { name: 'Tirishqoq daho',        kind: 'lesson', n: 99 },
  { name: "Cho'qqi",               kind: 'lesson', n: 100, gold: true, Icon: Crown },
]

const PALETTE = [
  { color: 'text-blue-600',    bg: 'bg-blue-50',    ring: 'ring-blue-200' },
  { color: 'text-indigo-600',  bg: 'bg-indigo-50',  ring: 'ring-indigo-200' },
  { color: 'text-violet-600',  bg: 'bg-violet-50',  ring: 'ring-violet-200' },
  { color: 'text-cyan-600',    bg: 'bg-cyan-50',    ring: 'ring-cyan-200' },
  { color: 'text-teal-600',    bg: 'bg-teal-50',    ring: 'ring-teal-200' },
  { color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200' },
  { color: 'text-sky-600',     bg: 'bg-sky-50',     ring: 'ring-sky-200' },
  { color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', ring: 'ring-fuchsia-200' },
  { color: 'text-rose-600',    bg: 'bg-rose-50',    ring: 'ring-rose-200' },
]
const GOLD = { color: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-200' }
const KIND_ICON: Record<Kind, LucideIcon> = { lesson: BookOpen, test: Keyboard, wpm: Zap, acc: Target, streak: Flame }

function descFor(d: Def): string {
  switch (d.kind) {
    case 'lesson': return d.n === 1 ? 'Birinchi darsni tugating' : `${d.n} ta darsni tugating`
    case 'test':   return `${d.n} ta yozish testini bajaring`
    case 'wpm':    return `Testda ${d.n} WPM tezlikka yeting`
    case 'acc':    return `Testda ${d.n}% aniqlikka yeting`
    case 'streak': return `${d.n} kun ketma-ket mashq qiling`
  }
}

function passed(d: Def, s: Stats): boolean {
  switch (d.kind) {
    case 'lesson': return s.lessonsCompleted >= d.n
    case 'test':   return s.totalTests       >= d.n
    case 'wpm':    return s.bestWpm           >= d.n
    case 'acc':    return s.bestAccuracy      >= d.n
    case 'streak': return s.streak            >= d.n
  }
}

const ACHIEVEMENTS = DEFS.map((d, i) => {
  // Lessons were split 100 → 600, so scale lesson thresholds ×6 (keep the very
  // first at 1). Quarter/half/three-quarter milestones stay proportional.
  const def: Def = d.kind === 'lesson' && d.n > 1 ? { ...d, n: d.n * 6 } : d
  return {
    id:    `a-${i + 1}`,
    title: def.name,
    desc:  descFor(def),
    Icon:  def.Icon ?? KIND_ICON[def.kind],
    milestone: !!def.gold,
    ...(def.gold ? GOLD : PALETTE[i % PALETTE.length]),
    def,
  }
})

type Resolved = (typeof ACHIEVEMENTS)[number]

function Card({ a, unlocked }: { a: Resolved; unlocked: boolean }) {
  if (!unlocked) {
    return (
      <div className="flex items-start gap-3.5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700/60 dark:bg-slate-900/40">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <a.Icon className="h-5 w-5 text-slate-300 dark:text-slate-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500">{a.title}</p>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-600">{a.desc}</p>
        </div>
        <Lock className="h-3.5 w-3.5 flex-shrink-0 text-slate-300 dark:text-slate-600" />
      </div>
    )
  }
  return (
    <div className={cn(
      'relative flex items-start gap-3.5 overflow-hidden rounded-2xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
      a.milestone ? 'border-amber-200 bg-gradient-to-br from-amber-50/80 to-white dark:border-amber-900/50 dark:from-amber-950/30 dark:to-slate-900' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
    )}>
      <div className={cn('absolute inset-y-0 left-0 w-1', a.bg.replace('-50', '-400'))} />
      <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ring-1 dark:bg-slate-800 dark:ring-slate-700', a.bg, a.ring)}>
        <a.Icon className={cn('h-5 w-5', a.color)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{a.title}</p>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{a.desc}</p>
      </div>
      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
    </div>
  )
}

export default async function AchievementsPage() {
  const userId = await getSession()
  if (!userId) redirect('/login')

  const db   = getDb()
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) redirect('/login')

  const [lessonsCompleted, testAgg, activity] = await Promise.all([
    db.lessonProgress.count({ where: { userId, completed: true } }),
    db.result.aggregate({ where: { userId, type: 'test' }, _count: true, _max: { wpm: true, accuracy: true } }),
    db.result.findMany({ where: { userId }, select: { createdAt: true } }),
  ])

  // Daily streak — consecutive days (ending today) with any recorded activity
  const dayset = new Set(activity.map(r => {
    const d = new Date(r.createdAt); d.setHours(0, 0, 0, 0); return d.getTime()
  }))
  let streak = 0
  const day = new Date(); day.setHours(0, 0, 0, 0)
  while (dayset.has(day.getTime())) { streak++; day.setDate(day.getDate() - 1) }

  const stats: Stats = {
    lessonsCompleted,
    totalTests:   testAgg._count,
    bestWpm:      testAgg._max.wpm ?? 0,
    bestAccuracy: testAgg._max.accuracy ?? 0,
    streak,
  }

  const unlocked = ACHIEVEMENTS.filter(a => passed(a.def, stats))
  const locked   = ACHIEVEMENTS.filter(a => !passed(a.def, stats))
  const pct      = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Trophy className="h-5 w-5 text-amber-500" />
            Yutuqlar
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {unlocked.length}/{ACHIEVEMENTS.length} ta yutuq ochilgan
          </p>
        </div>

        {/* Progress */}
        <div className="flex w-full flex-col items-end gap-1.5 sm:w-64">
          <span className="font-mono text-sm font-extrabold text-amber-600 dark:text-amber-400">{pct}%</span>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
              style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Ochilgan · {unlocked.length}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {unlocked.map(a => <Card key={a.id} a={a} unlocked />)}
          </div>
        </section>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Qulflangan · {locked.length}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {locked.map(a => <Card key={a.id} a={a} unlocked={false} />)}
          </div>
        </section>
      )}

      {/* Empty state */}
      {lessonsCompleted === 0 && stats.totalTests === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 py-14 text-center dark:border-slate-700">
          <Trophy className="h-10 w-10 text-slate-200 dark:text-slate-700" />
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">Hali birorta yutuq yo&apos;q</p>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Birinchi darsni tugating va yutuq oching</p>
          </div>
          <a href="/lessons"
            className="mt-1 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-blue-700">
            Darslarni boshlash
          </a>
        </div>
      )}
    </div>
  )
}
