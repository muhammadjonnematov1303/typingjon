import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getLessons, getCompletedLessonIds, getLessonStats, getLessonBestWpm } from '@/lib/lessons'
import { BookOpen, Check, ChevronRight, Lock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

async function requireUser() {
  const userId = await getSession()
  if (!userId) redirect('/login')
  return userId
}

export default async function LessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const userId = await requireUser()
  const { category } = await searchParams

  const [lessons, completedIds, lessonStats, bestWpmByLesson] = await Promise.all([
    getLessons(),
    getCompletedLessonIds(userId),
    getLessonStats(userId),
    getLessonBestWpm(userId),
  ])

  // Build category tabs in the order categories first appear
  const tabs: { name: string; count: number; min: number; max: number }[] = []
  for (const lesson of lessons) {
    const tab = tabs.find(t => t.name === lesson.category)
    if (tab) {
      tab.count++
      tab.min = Math.min(tab.min, lesson.order)
      tab.max = Math.max(tab.max, lesson.order)
    } else {
      tabs.push({ name: lesson.category, count: 1, min: lesson.order, max: lesson.order })
    }
  }

  const active   = category && tabs.some(t => t.name === category) ? category : null
  const visible  = active ? lessons.filter(l => l.category === active) : lessons
  const completedCount = lessons.filter(l => completedIds.has(l.id)).length

  const stats = [
    { label: 'Jami darslar',   value: lessons.length,      icon: BookOpen, color: 'text-blue-600',    bg: 'bg-blue-50',    accent: 'bg-blue-500'    },
    { label: 'Tugatilgan',     value: completedCount,      icon: Check,    color: 'text-emerald-600', bg: 'bg-emerald-50', accent: 'bg-emerald-500' },
    { label: 'Eng yuqori WPM', value: lessonStats.bestWpm, icon: Zap,      color: 'text-violet-600',  bg: 'bg-violet-50',  accent: 'bg-violet-500'  },
  ]

  // A lesson is locked until the previous one (by order) is completed
  const lockedIds = new Set<string>()
  for (let i = 1; i < lessons.length; i++) {
    if (!completedIds.has(lessons[i].id) && !completedIds.has(lessons[i - 1].id)) {
      lockedIds.add(lessons[i].id)
    }
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Darslar
        </h1>
        <p className="text-sm text-slate-400">100 qadamli kontekst injeneriya kursi</p>
      </div>

      {/* Stats grid */}
      {lessons.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, color, bg, accent }) => (
            <div key={label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900">
              <div className={cn('absolute inset-x-0 top-0 h-1 opacity-60', accent)} />
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', bg, 'dark:bg-slate-800')}>
                <Icon className={cn('h-4 w-4', color)} />
              </div>
              <p className="mt-3 font-mono text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Category tabs */}
      {tabs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <a
            href="/lessons"
            className={cn(
              'flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors',
              !active
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700/60',
            )}
          >
            Barchasi
            <span className={cn(
              'rounded-full px-1.5 py-0.5 text-[10px]',
              !active ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800',
            )}>
              {lessons.length}
            </span>
          </a>
          {tabs.map(tab => (
            <a
              key={tab.name}
              href={`/lessons?category=${encodeURIComponent(tab.name)}`}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors',
                active === tab.name
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700/60',
              )}
            >
              {tab.name}
              <span className="font-medium opacity-60">({tab.min}-{tab.max})</span>
              <span className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px]',
                active === tab.name ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800',
              )}>
                {tab.count}
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Empty state */}
      {lessons.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <BookOpen className="h-7 w-7 text-slate-300 dark:text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Hali darslar yo&apos;q</p>
            <p className="mt-1 text-xs text-slate-400">Tez orada yangi darslar qo&apos;shiladi</p>
          </div>
        </div>
      )}

      {/* Lessons grid */}
      {visible.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(lesson => {
            const done   = completedIds.has(lesson.id)
            const locked = !done && lockedIds.has(lesson.id)
            const bestWpm = bestWpmByLesson.get(lesson.id) ?? null
            const Card   = locked ? 'div' : 'a'

            return (
              <Card
                key={lesson.id}
                {...(!locked && { href: `/lessons/${lesson.order}` })}
                className={cn(
                  'group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-4 shadow-sm transition-all',
                  done && 'border-emerald-100 bg-emerald-50/50 hover:border-emerald-200 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900 dark:hover:border-emerald-700/50',
                  locked && 'cursor-not-allowed border-slate-200 bg-white dark:border-slate-700/60 dark:bg-slate-900',
                  !done && !locked && 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900 dark:hover:border-blue-700/40',
                )}
              >
                <span className={cn(
                  'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl font-mono text-sm font-extrabold',
                  done && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
                  locked && 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
                  !done && !locked && 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                )}>
                  {lesson.order}
                </span>

                <div className="min-w-0 flex-1">
                  <p className={cn(
                    'truncate text-sm font-bold leading-snug transition-colors',
                    done && 'text-slate-800 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-400',
                    locked && 'text-slate-400 dark:text-slate-500',
                    !done && !locked && 'text-slate-800 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400',
                  )}>
                    {lesson.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20">
                      {lesson.category}
                    </span>
                    {bestWpm != null && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                        <Zap className="h-2.5 w-2.5" />
                        {bestWpm} WPM
                      </span>
                    )}
                  </div>
                </div>

                {done ? (
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                ) : locked ? (
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    <Lock className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                ) : (
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
