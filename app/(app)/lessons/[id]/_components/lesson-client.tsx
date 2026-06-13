'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Sparkles, RotateCcw, ArrowRight, Menu, Zap, Target, TrendingUp, Clock, AlertTriangle, Trophy } from 'lucide-react'
import { LessonExercise, type LessonResult } from '../../_components/lesson-exercise'
import type { Lesson } from '@/lib/lessons'

interface Props {
  lesson: Lesson
  nextLessonId: string | null
  initialBest: { wpm: number | null; accuracy: number | null } | null
}

export function LessonClient({ lesson, nextLessonId, initialBest }: Props) {
  const router = useRouter()
  const [result,    setResult]    = useState<LessonResult | null>(null)
  const [saving,    setSaving]    = useState(false)
  const [resetKey,  setResetKey]  = useState(0)

  async function handleComplete(res: LessonResult) {
    setResult(res)
    setSaving(true)
    try {
      await fetch('/api/lessons/complete', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ lessonId: lesson.id, wpm: res.wpm, accuracy: res.accuracy, duration: res.duration }),
      })
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  function retry() {
    setResult(null)
    setResetKey(k => k + 1)
  }

  function goNext() {
    if (nextLessonId) router.push(`/lessons/${nextLessonId}`)
    else router.push('/lessons')
  }

  return (
    <div className="relative mx-auto flex h-full w-full max-w-[1180px] flex-col items-center justify-center gap-5 px-6 py-6">

      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="tj-float-slow absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="tj-float absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex w-full items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-3">
          <a href="/lessons" aria-label="Darslarga qaytish"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <Menu className="h-5 w-5" />
          </a>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-slate-900 dark:text-white">{lesson.order}-dars: {lesson.title}</h1>
            <p className="truncate text-xs text-slate-400 dark:text-slate-500">{lesson.description}</p>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          <span className="hidden rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 ring-1 ring-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700 sm:inline-flex">
            {lesson.difficulty}
          </span>
          {initialBest?.wpm != null && (
            <span className="hidden items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 ring-1 ring-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-900/40 sm:inline-flex">
              <Zap className="h-3.5 w-3.5" />
              Rekord: {initialBest.wpm} WPM
            </span>
          )}
          <div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1 ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
            <button onClick={retry} aria-label="Qayta boshlash"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200">
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Exercise */}
      <LessonExercise text={lesson.text} onComplete={handleComplete} resetKey={resetKey} />

      {/* Result modal */}
      {result && (() => {
        const tier = result.wpm >= 80 ? 'great' : result.wpm >= 50 ? 'good' : 'ok'
        const isRecord = initialBest?.wpm == null || result.wpm > initialBest.wpm
        const stats = [
          { label: 'Aniqlik',     value: `${result.accuracy}%`,    icon: Target,         color: 'text-blue-600',    bg: 'bg-blue-50' },
          { label: 'Barqarorlik', value: `${result.consistency}%`, icon: TrendingUp,      color: 'text-violet-600',  bg: 'bg-violet-50' },
          { label: 'Vaqt',        value: `${result.duration}s`,    icon: Clock,           color: 'text-slate-600',   bg: 'bg-slate-100' },
          { label: 'Xatolar',     value: `${result.errors}`,       icon: AlertTriangle,   color: 'text-rose-600',    bg: 'bg-rose-50' },
        ]
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-6 backdrop-blur-sm transition-opacity duration-200">
          <div className="tj-reveal tj-visible w-full max-w-md rounded-[1.75rem] bg-gradient-to-br from-blue-200/70 via-white to-indigo-200/60 p-[1px] shadow-[0_24px_70px_-20px_rgba(15,23,42,0.35)] dark:from-blue-900/50 dark:via-slate-900 dark:to-indigo-900/50">
            <div className="overflow-hidden rounded-[calc(1.75rem-1px)] bg-white dark:bg-slate-900">

              {/* Header */}
              <div className="flex items-center gap-3 px-7 pt-7">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${
                  tier === 'great' ? 'bg-emerald-50' : tier === 'good' ? 'bg-blue-50' : 'bg-slate-100'
                }`}>
                  <Sparkles className={`h-6 w-6 ${
                    tier === 'great' ? 'text-emerald-500' : tier === 'good' ? 'text-blue-500' : 'text-slate-400'
                  }`} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Dars yakunlandi!</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {tier === 'great' ? 'Ajoyib natija!' : tier === 'good' ? 'Yaxshi natija!' : "Ko'proq mashq qiling!"}
                    {saving && ' · saqlanmoqda…'}
                  </p>
                </div>
              </div>

              {/* Hero WPM */}
              <div className="relative mt-5 px-7">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/60 to-white px-6 py-6 text-center ring-1 ring-blue-100/70 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900 dark:ring-blue-900/40">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-200/30 blur-2xl" />
                  {isRecord && (
                    <span className="absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-600 ring-1 ring-amber-200">
                      <Trophy className="h-3 w-3" /> Yangi rekord
                    </span>
                  )}
                  <div className={`bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text font-mono text-7xl font-extrabold tracking-tight text-transparent ${isRecord ? 'mt-4' : ''}`}>
                    {result.wpm}
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    <Zap className="h-3.5 w-3.5 text-blue-400" />
                    so&apos;z / daqiqa
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 px-7 sm:grid-cols-4">
                {stats.map(s => (
                  <div key={s.label} className="rounded-xl border border-slate-100 bg-white px-2 py-3 text-center shadow-[0_2px_8px_-4px_rgba(15,23,42,0.1)] dark:border-slate-800 dark:bg-slate-800/40">
                    <div className={`mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg ${s.bg} dark:bg-slate-800`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                    <div className="font-mono text-lg font-bold text-slate-900 dark:text-white">{s.value}</div>
                    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-2.5 px-7 pb-7">
                <button onClick={retry}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                  <RotateCcw className="h-4 w-4" />
                  Qayta urinish
                </button>
                <button onClick={goNext}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/40">
                  {nextLessonId ? <>Keyingi dars <ArrowRight className="h-4 w-4" /></> : <><Target className="h-4 w-4" /> Darslar ro&apos;yxati</>}
                </button>
              </div>
            </div>
          </div>
        </div>
        )
      })()}
    </div>
  )
}
