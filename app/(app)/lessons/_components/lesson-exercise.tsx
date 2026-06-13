'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AlertTriangle, Zap, Target, Clock, Flame, TrendingUp, Eye, Keyboard, SkipForward } from 'lucide-react'
import { KeyboardGuide } from './keyboard-guide'

export interface LessonResult { wpm: number; accuracy: number; consistency: number; duration: number; errors: number }

interface Props {
  text: string
  onComplete: (result: LessonResult) => void
  resetKey?: number
}

type CharState = 'correct' | 'corrected' | 'wrong' | 'cursor' | 'pending' | 'demo'
type Phase = 'learn' | 'practice'

const STEP_COUNT = 6

// Split a lesson into up to 6 word-balanced steps. Each step is first
// demonstrated (the app types it), then practised by the user.
function splitSteps(text: string): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const count = Math.min(STEP_COUNT, Math.max(words.length, 1))
  const steps: string[] = []
  for (let k = 0; k < count; k++) {
    const start = Math.floor((k * words.length) / count)
    const end   = Math.floor(((k + 1) * words.length) / count)
    steps.push(words.slice(start, end).join(' '))
  }
  return steps
}

export function LessonExercise({ text, onComplete, resetKey }: Props) {
  const steps      = useMemo(() => splitSteps(text), [text])
  const totalChars = useMemo(() => steps.reduce((a, s) => a + s.length, 0), [steps])

  const [stepIndex, setStepIndex] = useState(0)
  const [phase,     setPhase]     = useState<Phase>('learn')
  const [demoLen,   setDemoLen]   = useState(0)
  const [typed,     setTyped]     = useState('')
  const [done,      setDone]      = useState(false)
  const [now,       setNow]       = useState(0)
  const [caret,  setCaret]  = useState({ top: 0, left: 0, height: 0 })
  const [scroll, setScroll] = useState({ lineHeight: 0, offset: 0 })
  const [penaltyCountdown, setPenaltyCountdown] = useState<number | null>(null)

  const stepText = steps[stepIndex] ?? ''

  const inputEl      = useRef<HTMLInputElement>(null)
  const typedRef     = useRef('')
  const stepStartRef = useRef(0)
  const samplesRef   = useRef<number[]>([])
  const sampleTimer  = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const demoTimer    = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const doneRef      = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const charRefs     = useRef<Array<HTMLSpanElement | null>>([])
  const correctedRef = useRef<Set<number>>(new Set())
  const consecutiveWrongRef = useRef(0)
  const penaltyDelayRef     = useRef(5)
  // Accumulated across completed steps, for the final aggregate result
  const accCharsRef  = useRef(0)
  const accErrorsRef = useRef(0)
  const accTimeMsRef = useRef(0)

  const wordRanges = useMemo(() => {
    const ranges: Array<{ start: number; end: number }> = []
    let start = -1
    for (let i = 0; i <= stepText.length; i++) {
      const isBoundary = i === stepText.length || stepText[i] === ' '
      if (!isBoundary && start === -1) start = i
      else if (isBoundary && start !== -1) { ranges.push({ start, end: i }); start = -1 }
    }
    return ranges
  }, [stepText])

  function resetAll() {
    clearInterval(sampleTimer.current)
    clearInterval(demoTimer.current)
    doneRef.current     = false
    typedRef.current    = ''
    stepStartRef.current = 0
    samplesRef.current  = []
    correctedRef.current = new Set()
    accCharsRef.current  = 0
    accErrorsRef.current = 0
    accTimeMsRef.current = 0
    consecutiveWrongRef.current = 0
    penaltyDelayRef.current = 5
    setStepIndex(0)
    setPhase('learn')
    setDemoLen(0)
    setTyped('')
    setDone(false)
    setNow(0)
    setPenaltyCountdown(null)
  }

  // Restart whenever the lesson changes
  useLayoutEffect(() => {
    resetAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, resetKey])

  // ── Demo (learn phase): the app auto-types the current step ──
  useEffect(() => {
    if (done || phase !== 'learn' || !stepText) return
    setDemoLen(0)
    let i = 0
    demoTimer.current = setInterval(() => {
      i++
      setDemoLen(i)
      if (i >= stepText.length) {
        clearInterval(demoTimer.current)
        // brief pause so the learner reads the finished line, then practise
        setTimeout(() => {
          setPhase('practice')
          setTimeout(() => inputEl.current?.focus(), 60)
        }, 650)
      }
    }, 78)
    return () => clearInterval(demoTimer.current)
  }, [phase, stepIndex, stepText, done])

  function startDemoSkip() {
    clearInterval(demoTimer.current)
    setPhase('practice')
    setTimeout(() => inputEl.current?.focus(), 60)
  }

  // Live clock during practice
  useEffect(() => {
    if (phase !== 'practice' || done) return
    const id = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(id)
  }, [phase, done])

  // Re-focus the hidden input on any printable keystroke during practice
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        phase === 'practice' && e.key.length === 1 &&
        !e.ctrlKey && !e.metaKey && !e.altKey &&
        !done && penaltyCountdown == null &&
        document.activeElement !== inputEl.current
      ) {
        inputEl.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase, done, penaltyCountdown])

  // Penalty countdown — restart the current step's practice once it hits 0
  useEffect(() => {
    if (penaltyCountdown == null) return
    if (penaltyCountdown <= 0) {
      penaltyDelayRef.current += 3
      setPenaltyCountdown(null)
      correctedRef.current = new Set()
      typedRef.current = ''
      stepStartRef.current = 0
      setTyped('')
      setTimeout(() => inputEl.current?.focus(), 50)
      return
    }
    const t = setTimeout(() => setPenaltyCountdown(c => (c ?? 1) - 1), 1000)
    return () => clearTimeout(t)
  }, [penaltyCountdown])

  function computeConsistency(): number {
    const samples = samplesRef.current.filter(s => s > 0)
    if (samples.length < 2) return 100
    const mean     = samples.reduce((a, b) => a + b, 0) / samples.length
    const variance = samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length
    const stddev   = Math.sqrt(variance)
    return mean > 0 ? Math.max(0, Math.min(100, Math.round(100 - (stddev / mean) * 100))) : 100
  }

  function startPractice() {
    stepStartRef.current = Date.now()
    setNow(Date.now())
    clearInterval(sampleTimer.current)
    sampleTimer.current = setInterval(() => {
      const liveChars = accCharsRef.current + typedRef.current.length
      const ms = accTimeMsRef.current + (Date.now() - stepStartRef.current)
      samplesRef.current.push(Math.round((liveChars / 5) / Math.max(ms / 60000, 0.001)))
    }, 1000)
  }

  function finish() {
    if (doneRef.current) return
    doneRef.current = true
    clearInterval(sampleTimer.current)
    const chars   = accCharsRef.current
    const errors  = accErrorsRef.current
    const durSec  = Math.max(accTimeMsRef.current / 1000, 0.02)
    const correct = Math.max(chars - errors, 0)
    const acc     = chars > 0 ? Math.round((correct / chars) * 100) : 0
    const wpm     = Math.round((chars / 5) / Math.max(durSec / 60, 0.02))
    setDone(true)
    onComplete({ wpm, accuracy: acc, consistency: computeConsistency(), duration: Math.round(durSec), errors })
  }

  function completeStep() {
    accCharsRef.current  += stepText.length
    accErrorsRef.current += correctedRef.current.size
    accTimeMsRef.current += stepStartRef.current ? (Date.now() - stepStartRef.current) : 0
    clearInterval(sampleTimer.current)

    if (stepIndex < steps.length - 1) {
      correctedRef.current = new Set()
      typedRef.current = ''
      stepStartRef.current = 0
      consecutiveWrongRef.current = 0
      setTyped('')
      setDemoLen(0)
      setStepIndex(i => i + 1)
      setPhase('learn')
    } else {
      finish()
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (done || phase !== 'practice' || penaltyCountdown != null) return
    const raw = e.target.value
    if (!stepStartRef.current) startPractice()

    const val = raw.slice(0, stepText.length)
    const prevLen = typed.length
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== stepText[i]) correctedRef.current.add(i)
    }

    let triggeredPenalty = false
    for (const { start, end } of wordRanges) {
      if (end > prevLen && end <= val.length) {
        let fullyWrong = true
        for (let i = start; i < end; i++) {
          if (val[i] === stepText[i]) { fullyWrong = false; break }
        }
        if (fullyWrong) {
          consecutiveWrongRef.current++
          if (consecutiveWrongRef.current >= 3) { consecutiveWrongRef.current = 0; triggeredPenalty = true }
        } else {
          consecutiveWrongRef.current = 0
        }
      }
    }

    setTyped(val); typedRef.current = val

    if (triggeredPenalty) { setPenaltyCountdown(penaltyDelayRef.current); return }
    if (val.length === stepText.length) completeStep()
  }

  const activeLen = phase === 'learn' ? demoLen : typed.length

  const chars: { ch: string; state: CharState }[] = stepText.split('').map((ch, i) => {
    if (phase === 'learn') {
      return { ch, state: i < demoLen ? 'demo' : i === demoLen ? 'cursor' : 'pending' }
    }
    return {
      ch,
      state: i < typed.length
        ? (typed[i] === ch ? (correctedRef.current.has(i) ? 'corrected' : 'correct') : 'wrong')
        : i === typed.length ? 'cursor' : 'pending',
    }
  })

  const nearRange = useMemo(() => {
    const set = new Set<number>()
    const idx = wordRanges.findIndex(r => activeLen >= r.start && activeLen <= r.end)
    if (idx !== -1) {
      for (let i = wordRanges[idx].start; i < wordRanges[idx].end; i++) set.add(i)
      const next = wordRanges[idx + 1]
      if (next) for (let i = next.start; i < next.end; i++) set.add(i)
    }
    return set
  }, [wordRanges, activeLen])

  function renderChar(i: number): ReactNode {
    const { ch, state } = chars[i]
    const justTyped = phase === 'practice' && i === typed.length - 1
    const pop       = justTyped && (state === 'correct' || state === 'corrected') ? ' tj-key-pop'   : ''
    const shake     = justTyped && state === 'wrong'                              ? ' tj-key-shake' : ''
    return (
      <span key={i}
        ref={(el) => { charRefs.current[i] = el }}
        className={`inline-block rounded-[6px] px-[1px] transition-colors duration-150${pop}${shake} ${
          state === 'demo'      ? 'text-blue-500 dark:text-blue-400' :
          state === 'correct'   ? 'text-slate-700 dark:text-slate-200' :
          state === 'corrected' ? 'text-amber-500' :
          state === 'wrong'     ? 'bg-red-100 text-red-500 dark:bg-red-950/50 dark:text-red-400' :
          state === 'cursor'    ? 'bg-blue-600 text-white shadow-[0_2px_10px_-2px_rgba(37,99,235,0.65)]' :
          nearRange.has(i)      ? 'text-slate-400 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600'
        }`}>{ch}</span>
    )
  }

  const wordGroups: ReactNode[] = []
  let bucket: number[] = []
  const flushWord = (key: string) => {
    if (!bucket.length) return
    wordGroups.push(<span key={key} className="whitespace-nowrap">{bucket.map(renderChar)}</span>)
    bucket = []
  }
  for (let i = 0; i < stepText.length; i++) {
    if (stepText[i] === ' ') { flushWord(`w${i}`); wordGroups.push(renderChar(i)) }
    else bucket.push(i)
  }
  flushWord('wend')

  // Caret + 3-line scroll, follows the active position (demo or practice)
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || !stepText) return
    const idx = Math.min(activeLen, stepText.length - 1)
    const el  = charRefs.current[idx]
    if (!el) return
    const elRect   = el.getBoundingClientRect()
    const contRect = container.getBoundingClientRect()
    const atEnd    = activeLen >= stepText.length
    const top      = elRect.top - contRect.top
    setCaret({ top, left: (atEnd ? elRect.right : elRect.left) - contRect.left, height: elRect.height })

    const lineHeight = parseFloat(getComputedStyle(container).lineHeight) || elRect.height
    const lineIndex  = activeLen === 0 ? 0 : lineHeight > 0 ? Math.round(top / lineHeight) : 0
    setScroll({ lineHeight, offset: lineIndex * lineHeight })
  }, [activeLen, stepText, phase])

  // ── Live stats (accumulated across steps + current step) ──
  const liveChars  = accCharsRef.current + (phase === 'practice' ? typed.length : 0)
  const liveErrors = accErrorsRef.current + (phase === 'practice' ? correctedRef.current.size : 0)
  const elapsedMs  = accTimeMsRef.current + (phase === 'practice' && stepStartRef.current ? (now - stepStartRef.current) : 0)
  const liveWpm    = elapsedMs > 0 ? Math.round((liveChars / 5) / Math.max(elapsedMs / 60000, 0.001)) : 0
  const liveAcc    = liveChars > 0 ? Math.round(((liveChars - liveErrors) / liveChars) * 100) : 100
  const progress   = totalChars > 0 ? Math.min(100, Math.round((liveChars / totalChars) * 100)) : 0

  let streak = 0
  if (phase === 'practice') {
    for (let i = typed.length - 1; i >= 0; i--) { if (typed[i] === stepText[i]) streak++; else break }
  }

  const nextChar = done ? null : stepText[activeLen] ?? null

  return (
    <div className="flex w-full flex-col items-center gap-4">

      {/* Step + phase indicator */}
      <div className="flex w-full max-w-xl items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
          phase === 'learn'
            ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-900/40'
            : 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-900/40'
        }`}>
          {phase === 'learn' ? <><Eye className="h-3.5 w-3.5" /> O&apos;rganish — kuzating</> : <><Keyboard className="h-3.5 w-3.5" /> Mashq — siz yozing</>}
        </span>

        <div className="flex items-center gap-1.5">
          {steps.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${
              i < stepIndex ? 'w-4 bg-emerald-500'
              : i === stepIndex ? 'w-6 bg-blue-600'
              : 'w-4 bg-slate-200 dark:bg-slate-700'
            }`} />
          ))}
          <span className="ml-1.5 font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">{stepIndex + 1}/{steps.length}</span>
        </div>
      </div>

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
          {Math.round(elapsedMs / 1000)}s
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
          onClick={() => phase === 'practice' && inputEl.current?.focus()}
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
                className={`tj-caret absolute rounded-full ${phase === 'learn' ? 'opacity-60' : ''}`}
                style={{ top: caret.top, left: caret.left, height: caret.height || '1em', transition: 'top 100ms ease, left 100ms ease' }}
              />
            </div>

            <input
              ref={inputEl}
              value={typed}
              onChange={handleChange}
              disabled={done || phase !== 'practice' || penaltyCountdown != null}
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

      {/* Learn-phase hint + skip */}
      {phase === 'learn' && !done && (
        <button onClick={startDemoSkip}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
          <SkipForward className="h-3.5 w-3.5" />
          O&apos;tkazib yuborib, o&apos;zim yozaman
        </button>
      )}

      <KeyboardGuide nextChar={nextChar} />

      {/* Penalty modal — shown after 3 consecutive fully-mistyped words */}
      {penaltyCountdown != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 p-6 backdrop-blur-[2px] dark:bg-slate-950/40">
          <div className="tj-reveal tj-visible w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
            <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Siz xato yozyapsiz!</h2>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Bu bosqich qaytadan boshlanadi</p>
            <div className="mt-5 font-mono text-5xl font-extrabold tracking-tight text-red-500">{penaltyCountdown}</div>
          </div>
        </div>
      )}
    </div>
  )
}
