'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AlertTriangle, Zap, Target, Clock, Flame, TrendingUp } from 'lucide-react'
import { KeyboardGuide } from './keyboard-guide'

export interface LessonResult { wpm: number; accuracy: number; consistency: number; duration: number; errors: number }

interface Props {
  text: string
  onComplete: (result: LessonResult) => void
  resetKey?: number
}

type CharState = 'correct' | 'corrected' | 'wrong' | 'cursor' | 'pending'

export function LessonExercise({ text, onComplete, resetKey }: Props) {
  const [typed,   setTyped]   = useState('')
  const [done,    setDone]    = useState(false)
  const [started, setStarted] = useState(false)
  const [now,     setNow]     = useState(0)
  const [caret,  setCaret]  = useState({ top: 0, left: 0, height: 0 })
  const [scroll, setScroll] = useState({ lineHeight: 0, offset: 0 })
  const [penaltyCountdown, setPenaltyCountdown] = useState<number | null>(null)

  const inputEl      = useRef<HTMLInputElement>(null)
  const typedRef     = useRef('')
  const startRef     = useRef(0)
  const samplesRef   = useRef<number[]>([])
  const timerRef     = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const doneRef      = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const charRefs     = useRef<Array<HTMLSpanElement | null>>([])
  const correctedRef = useRef<Set<number>>(new Set())
  const consecutiveWrongRef = useRef(0)
  const penaltyDelayRef     = useRef(3)

  // Word boundaries within `text`, used to detect fully-mistyped words
  const wordRanges = useMemo(() => {
    const ranges: Array<{ start: number; end: number }> = []
    let start = -1
    for (let i = 0; i <= text.length; i++) {
      const isBoundary = i === text.length || text[i] === ' '
      if (!isBoundary && start === -1) start = i
      else if (isBoundary && start !== -1) { ranges.push({ start, end: i }); start = -1 }
    }
    return ranges
  }, [text])

  function clearTyping() {
    clearInterval(timerRef.current)
    doneRef.current  = false
    typedRef.current = ''
    startRef.current = 0
    samplesRef.current   = []
    correctedRef.current = new Set()
    setTyped('')
    setDone(false)
    setStarted(false)
    setNow(0)
    setTimeout(() => inputEl.current?.focus(), 50)
  }

  function reset() {
    clearTyping()
    consecutiveWrongRef.current = 0
    penaltyDelayRef.current = 5
    setPenaltyCountdown(null)
  }

  // Restart the exercise whenever the lesson text changes
  useLayoutEffect(() => {
    reset()
    setTimeout(() => inputEl.current?.focus(), 100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, resetKey])

  // Live clock for the stats bar while the exercise is in progress
  useEffect(() => {
    if (!started || done) return
    const id = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(id)
  }, [started, done])

  // Re-focus the hidden input on any printable keystroke — if the input lost
  // focus (e.g. the tab was idle/backgrounded for a while), typing would
  // otherwise silently go nowhere until the user clicks the card again.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.key.length === 1 &&
        !e.ctrlKey && !e.metaKey && !e.altKey &&
        !done && penaltyCountdown == null &&
        document.activeElement !== inputEl.current
      ) {
        inputEl.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [done, penaltyCountdown])

  // Tick the penalty countdown; once it hits 0, restart the typing area with a longer delay next time
  useEffect(() => {
    if (penaltyCountdown == null) return
    if (penaltyCountdown <= 0) {
      penaltyDelayRef.current += 3
      setPenaltyCountdown(null)
      clearTyping()
      return
    }
    const timeout = setTimeout(() => setPenaltyCountdown(c => (c ?? 1) - 1), 1000)
    return () => clearTimeout(timeout)
  }, [penaltyCountdown])

  function computeConsistency(): number {
    const samples = samplesRef.current.filter(s => s > 0)
    if (samples.length < 2) return 100
    const mean     = samples.reduce((a, b) => a + b, 0) / samples.length
    const variance = samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length
    const stddev   = Math.sqrt(variance)
    return mean > 0 ? Math.max(0, Math.min(100, Math.round(100 - (stddev / mean) * 100))) : 100
  }

  function finish() {
    if (doneRef.current) return
    doneRef.current = true
    clearInterval(timerRef.current)
    const durSec  = Math.max((Date.now() - startRef.current) / 1000, 0.02)
    const t       = typedRef.current
    // A position counts as an error if it was EVER mistyped — even if the user
    // went back and corrected it. `correctedRef` accumulates every such index.
    const errors  = correctedRef.current.size
    const correct = Math.max(t.length - errors, 0)
    const acc     = t.length > 0 ? Math.round((correct / t.length) * 100) : 0
    const wpm     = Math.round((t.length / 5) / Math.max(durSec / 60, 0.02))
    setDone(true)
    onComplete({ wpm, accuracy: acc, consistency: computeConsistency(), duration: Math.round(durSec), errors })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (done || penaltyCountdown != null) return
    const raw = e.target.value
    if (!startRef.current) {
      startRef.current = Date.now()
      setStarted(true)
      setNow(Date.now())
      timerRef.current = setInterval(() => {
        const secs = (Date.now() - startRef.current) / 1000
        samplesRef.current.push(Math.round((typedRef.current.length / 5) / Math.max(secs / 60, 0.001)))
      }, 1000)
    }

    const val = raw.slice(0, text.length)
    const prevLen = typed.length
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== text[i]) correctedRef.current.add(i)
    }

    let triggeredPenalty = false
    for (const { start, end } of wordRanges) {
      if (end > prevLen && end <= val.length) {
        let fullyWrong = true
        for (let i = start; i < end; i++) {
          if (val[i] === text[i]) { fullyWrong = false; break }
        }
        if (fullyWrong) {
          consecutiveWrongRef.current++
          if (consecutiveWrongRef.current >= 3) {
            consecutiveWrongRef.current = 0
            triggeredPenalty = true
          }
        } else {
          consecutiveWrongRef.current = 0
        }
      }
    }

    setTyped(val); typedRef.current = val

    if (triggeredPenalty) {
      setPenaltyCountdown(penaltyDelayRef.current)
      return
    }

    if (val.length === text.length) finish()
  }

  type CharEntry = { ch: string; state: CharState }
  const chars: CharEntry[] = text.split('').map((ch, i) => ({
    ch,
    state: i < typed.length
      ? (typed[i] === ch ? (correctedRef.current.has(i) ? 'corrected' : 'correct') : 'wrong')
      : i === typed.length ? 'cursor' : 'pending',
  }))

  // The current word + the next one are highlighted slightly darker than the rest of the upcoming text
  const nearRange = useMemo(() => {
    const set = new Set<number>()
    const idx = wordRanges.findIndex(r => typed.length >= r.start && typed.length <= r.end)
    if (idx !== -1) {
      for (let i = wordRanges[idx].start; i < wordRanges[idx].end; i++) set.add(i)
      const next = wordRanges[idx + 1]
      if (next) for (let i = next.start; i < next.end; i++) set.add(i)
    }
    return set
  }, [wordRanges, typed.length])

  function renderChar(i: number): ReactNode {
    const { ch, state } = chars[i]
    const justTyped = i === typed.length - 1
    const pop       = justTyped && (state === 'correct' || state === 'corrected') ? ' tj-key-pop'   : ''
    const shake     = justTyped && state === 'wrong'                              ? ' tj-key-shake' : ''
    return (
      <span key={i}
        ref={(el) => { charRefs.current[i] = el }}
        className={`inline-block rounded-[6px] px-[1px] transition-colors duration-150${pop}${shake} ${
          state === 'correct'   ? 'text-slate-700 dark:text-slate-200' :
          state === 'corrected' ? 'text-amber-500' :
          state === 'wrong'     ? 'bg-red-100 text-red-500 dark:bg-red-950/50 dark:text-red-400' :
          state === 'cursor'    ? 'bg-blue-600 text-white shadow-[0_2px_10px_-2px_rgba(37,99,235,0.65)]' :
          nearRange.has(i)      ? 'text-slate-400 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600'
        }`}>{ch}</span>
    )
  }

  // Group characters into unbreakable word units so a word never splits across lines;
  // spaces remain standalone, providing the only line-break opportunities.
  const wordGroups: ReactNode[] = []
  let bucket: number[] = []
  const flushWord = (key: string) => {
    if (!bucket.length) return
    wordGroups.push(<span key={key} className="whitespace-nowrap">{bucket.map(renderChar)}</span>)
    bucket = []
  }
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') { flushWord(`w${i}`); wordGroups.push(renderChar(i)) }
    else bucket.push(i)
  }
  flushWord('wend')

  // Smooth sliding caret — measures the current character's position each keystroke
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || !text) return
    const idx = Math.min(typed.length, text.length - 1)
    const el  = charRefs.current[idx]
    if (!el) return
    const elRect   = el.getBoundingClientRect()
    const contRect = container.getBoundingClientRect()
    const atEnd    = typed.length >= text.length
    const top      = elRect.top - contRect.top
    setCaret({
      top,
      left:   (atEnd ? elRect.right : elRect.left) - contRect.left,
      height: elRect.height,
    })

    const lineHeight = parseFloat(getComputedStyle(container).lineHeight) || elRect.height
    // At the very start of the exercise, always show the text's first line —
    // never scroll it out of view, regardless of measurement rounding.
    const lineIndex  = typed.length === 0 ? 0 : lineHeight > 0 ? Math.round(top / lineHeight) : 0
    setScroll({ lineHeight, offset: lineIndex * lineHeight })
  }, [typed, text])

  const progress = text.length > 0 ? Math.round((typed.length / text.length) * 100) : 0

  // Live stats
  const elapsedSec = started ? Math.max((now - startRef.current) / 1000, 0) : 0
  const elapsedMin = elapsedSec / 60
  const liveWpm    = elapsedMin > 0 ? Math.round((typed.length / 5) / Math.max(elapsedMin, 0.001)) : 0
  const liveAcc    = typed.length > 0 ? Math.round(((typed.length - correctedRef.current.size) / typed.length) * 100) : 100

  let streak = 0
  for (let i = typed.length - 1; i >= 0; i--) {
    if (typed[i] === text[i]) streak++
    else break
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">

      {/* Stats bar */}
      <div className="flex w-full items-center justify-center gap-6 font-mono text-sm font-bold sm:gap-10">
        <span className="flex items-center gap-1.5 text-blue-600">
          <Zap className="h-4 w-4" />
          {liveWpm}
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-slate-400">wpm</span>
        </span>
        <span className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
        <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
          <Target className="h-4 w-4 text-slate-400" />
          {liveAcc}%
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-slate-400">aniqlik</span>
        </span>
        <span className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
        <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
          <Clock className="h-4 w-4 text-slate-400" />
          {Math.round(elapsedSec)}s
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-slate-400">vaqt</span>
        </span>
        <span className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
        <span className={`flex items-center gap-1.5 ${streak >= 10 ? 'text-orange-500' : 'text-slate-900 dark:text-white'}`}>
          <Flame className="h-4 w-4 text-slate-400" />
          {streak}
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-slate-400">streak</span>
        </span>
        <span className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
        <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
          <TrendingUp className="h-4 w-4 text-slate-400" />
          {progress}%
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-slate-400">progress</span>
        </span>
      </div>

      {/* Typing area */}
      <div className="w-full rounded-[1.5rem] bg-gradient-to-br from-blue-100/70 via-white to-indigo-100/60 p-[1px] shadow-[0_12px_40px_-16px_rgba(15,23,42,0.18)] transition-shadow hover:shadow-[0_16px_48px_-16px_rgba(15,23,42,0.24)] dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/40">
        <div
          className="group/card relative flex w-full items-stretch gap-3 overflow-hidden rounded-[calc(1.5rem-1px)] bg-white/80 p-3 backdrop-blur-xl transition-colors dark:bg-slate-900/80 sm:gap-4 sm:p-4"
          onClick={() => inputEl.current?.focus()}
        >
          {/* progress bar pinned to the top edge of the card */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-r-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-[width] duration-200 ease-out" style={{ width: `${progress}%` }} />
          </div>

          <div
            className="relative flex-1 overflow-hidden px-1 py-3"
            style={scroll.lineHeight ? { height: scroll.lineHeight * 3, boxSizing: 'content-box' } : undefined}
          >
            {/* ruled "writing lines" behind each visible row of text */}
            {scroll.lineHeight > 0 && (
              <div className="pointer-events-none absolute inset-x-0 top-0">
                {[1, 2, 3].map(n => (
                  <div key={n} className="absolute inset-x-0 border-b border-slate-100 dark:border-slate-800"
                    style={{ top: 12 + n * scroll.lineHeight - 3 }} />
                ))}
              </div>
            )}

            <div
              ref={containerRef}
              className="relative z-10 cursor-text select-none whitespace-pre-wrap text-left font-mono text-[19px] leading-[1.65] tracking-wide sm:text-[21px] lg:text-[23px]"
              style={{ transform: `translateY(-${scroll.offset}px)`, transition: 'transform 200ms ease' }}
            >
              {wordGroups}
              <span
                className="tj-caret absolute rounded-full"
                style={{ top: caret.top, left: caret.left, height: caret.height || '1em', transition: 'top 100ms ease, left 100ms ease' }}
              />
            </div>

            <input
              ref={inputEl}
              value={typed}
              onChange={handleChange}
              disabled={done || penaltyCountdown != null}
              className="sr-only"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Matn kiriting"
            />
          </div>
        </div>
      </div>

      <KeyboardGuide nextChar={done ? null : text[typed.length] ?? null} />

      {/* Penalty modal — shown after 3 consecutive fully-mistyped words */}
      {penaltyCountdown != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 p-6 backdrop-blur-[2px] dark:bg-slate-950/40">
          <div className="tj-reveal tj-visible w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
            <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Siz xato yozyapsiz!</h2>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Mashq qaytadan boshlanadi</p>
            <div className="mt-5 font-mono text-5xl font-extrabold tracking-tight text-red-500">{penaltyCountdown}</div>
          </div>
        </div>
      )}
    </div>
  )
}
