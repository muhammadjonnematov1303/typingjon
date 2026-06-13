'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { BookOpen, CheckCircle2, Circle, RotateCcw } from 'lucide-react'
import { setLessonProgressAction } from '@/app/actions/admin-users'
import { cn } from '@/lib/utils'
import { TABLE_HEAD_ROW, TABLE_HEAD_LABEL, ROW, GRID_USER_LESSONS, BADGE, TABLE_CELL_ACTIONS } from '../../../_lib/ui'

interface LessonItem {
  id:           string
  order:        number
  title:        string
  difficulty:   string
  category:     string
  completed:    boolean
  bestWpm:      number | null
  bestAccuracy: number | null
  attempts:     number
}

interface Props {
  userId:  string
  lessons: LessonItem[]
}

const HEADERS = ['#', 'Dars nomi', 'Turkumi', 'Tezligi', 'Aniqligi', "O'tkazish", 'Qaytarish']

export function LessonProgressList({ userId, lessons: initial }: Props) {
  const [lessons, setLessons] = useState(initial)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function setProgress(lessonId: string, completed: boolean) {
    setPendingId(lessonId)
    startTransition(async () => {
      const fd = new FormData()
      fd.set('userId', userId)
      fd.set('lessonId', lessonId)
      fd.set('completed', completed.toString())
      const res = await setLessonProgressAction(null, fd)
      setPendingId(null)
      if (res && 'error' in res) { toast.error(res.error); return }
      setLessons(prev => prev.map(l => l.id !== lessonId ? l : completed
        ? { ...l, completed: true, bestWpm: l.bestWpm ?? 0, bestAccuracy: l.bestAccuracy ?? 100, attempts: l.attempts || 1 }
        : { ...l, completed: false, bestWpm: null, bestAccuracy: null, attempts: 0 },
      ))
      toast.success(completed ? "Dars o'tilgan deb belgilandi" : 'Dars progressi qaytarildi')
    })
  }

  const completedCount = lessons.filter(l => l.completed).length

  return (
    <div>
      <p className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <BookOpen className="h-3.5 w-3.5" />
        Darslar progressi &middot; {completedCount}/{lessons.length}
      </p>
      {lessons.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-400">Hali darslar mavjud emas</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
          <div className={cn(TABLE_HEAD_ROW, GRID_USER_LESSONS)}>
            {HEADERS.map(h => (
              <span key={h} className={cn(TABLE_HEAD_LABEL, (h === "O'tkazish" || h === 'Qaytarish') && 'md:justify-self-center')}>
                {h}
              </span>
            ))}
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {lessons.map(l => {
              const pending = pendingId === l.id
              return (
                <div key={l.id} className={cn(ROW, GRID_USER_LESSONS)}>
                  {/* # */}
                  <span className={cn(
                    'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold',
                    l.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
                  )}>
                    {l.order}
                  </span>

                  {/* Dars nomi */}
                  <div className="flex min-w-0 items-center gap-2">
                    {l.completed
                      ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                      : <Circle className="h-4 w-4 flex-shrink-0 text-slate-300 dark:text-slate-600" />}
                    <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{l.title}</p>
                  </div>

                  {/* Turkumi */}
                  <span className={cn(BADGE, 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')}>
                    {l.category}
                  </span>

                  {/* Tezligi */}
                  <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {l.completed ? `${l.bestWpm ?? 0} so'z/d` : '—'}
                  </span>

                  {/* Aniqligi */}
                  <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {l.completed ? `${Math.round(l.bestAccuracy ?? 0)}%` : '—'}
                  </span>

                  {/* O'tkazish */}
                  <div className={cn(TABLE_CELL_ACTIONS, 'md:justify-self-center')}>
                    <button
                      type="button"
                      disabled={pending || l.completed}
                      onClick={() => setProgress(l.id, true)}
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      O&apos;tkazish
                    </button>
                  </div>

                  {/* Qaytarish */}
                  <div className={cn(TABLE_CELL_ACTIONS, 'md:justify-self-center')}>
                    <button
                      type="button"
                      disabled={pending || !l.completed}
                      onClick={() => setProgress(l.id, false)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Qaytarish
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
