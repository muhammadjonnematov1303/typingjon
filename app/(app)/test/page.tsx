'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  RotateCcw, Clock, Globe, Zap, Sparkles, Target, TrendingUp,
  AtSign, Hash, Type, Quote, Triangle, Wrench, Share2, Check,
  ChevronRight, AlertTriangle,
} from 'lucide-react'
import { calculateStats } from '@/lib/typing-stats'

const WORD_BANK = [
  'a', 'about', 'after', 'again', 'air', 'all', 'along', 'also', 'an', 'and', 'any', 'are', 'around', 'as', 'ask',
  'at', 'away', 'back', 'be', 'because', 'before', 'begin', 'between', 'big', 'both', 'but', 'by', 'call', 'can',
  'change', 'city', 'come', 'could', 'day', 'different', 'do', 'down', 'during', 'each', 'earth', 'end', 'even',
  'every', 'eye', 'fact', 'feel', 'few', 'find', 'first', 'for', 'form', 'found', 'from', 'get', 'give', 'go',
  'good', 'great', 'group', 'grow', 'hand', 'hard', 'have', 'he', 'head', 'help', 'her', 'here', 'high', 'him',
  'his', 'home', 'house', 'how', 'idea', 'if', 'important', 'in', 'into', 'is', 'it', 'its', 'just', 'keep',
  'kind', 'know', 'land', 'large', 'last', 'later', 'learn', 'leave', 'let', 'life', 'light', 'like', 'line',
  'list', 'little', 'live', 'long', 'look', 'made', 'make', 'man', 'many', 'may', 'me', 'mean', 'men', 'might',
  'more', 'most', 'move', 'much', 'must', 'my', 'name', 'need', 'never', 'new', 'next', 'no', 'not', 'now',
  'number', 'of', 'off', 'often', 'old', 'on', 'once', 'one', 'only', 'open', 'or', 'order', 'other', 'our',
  'out', 'over', 'own', 'page', 'part', 'people', 'place', 'plant', 'play', 'point', 'public', 'put', 'read',
  'really', 'right', 'run', 'same', 'say', 'school', 'sea', 'see', 'seem', 'set', 'she', 'should', 'show',
  'side', 'small', 'so', 'some', 'sound', 'spell', 'start', 'state', 'still', 'study', 'such', 'system', 'take',
  'tell', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'thing', 'think', 'this',
  'those', 'thought', 'three', 'through', 'time', 'to', 'too', 'try', 'turn', 'two', 'under', 'up', 'us',
  'use', 'very', 'want', 'water', 'way', 'we', 'well', 'went', 'were', 'what', 'when', 'where', 'which',
  'while', 'who', 'why', 'will', 'with', 'word', 'work', 'world', 'would', 'write', 'year', 'you', 'your',
]

const WORD_COUNT = 33
const DURATIONS = [15, 30, 60, 120]
const WORD_COUNTS = [10, 25, 50, 100]

const QUOTE_BANK = [
  'The only way to do great work is to love what you do.',
  'Life is what happens when you are busy making other plans.',
  'The future belongs to those who believe in the beauty of their dreams.',
  'It is during our darkest moments that we must focus to see the light.',
  'Success is not final, failure is not fatal: it is the courage to continue that counts.',
  'The way to get started is to quit talking and begin doing.',
  "Don't watch the clock; do what it does. Keep going.",
  'The only limit to our realization of tomorrow will be our doubts of today.',
  'You miss one hundred percent of the shots you never take.',
  'Whether you think you can or you think you cannot, you are right.',
]

function buildText(punctuation: boolean, numbers: boolean, count: number = WORD_COUNT, capitalizeFirst = true) {
  const words: string[] = []
  for (let i = 0; i < count; i++) {
    words.push(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)])
  }

  if (numbers) {
    const n = Math.max(1, Math.floor(words.length / 10))
    for (let i = 0; i < n; i++) {
      const pos = Math.floor(Math.random() * (words.length + 1))
      words.splice(pos, 0, String(Math.floor(Math.random() * 999) + 1))
    }
  }

  if (punctuation) {
    if (capitalizeFirst) words[0] = words[0][0].toUpperCase() + words[0].slice(1)
    for (let i = 6; i < words.length - 1; i += 7) words[i] += ','
    words[words.length - 1] += '.'
  }

  return words.join(' ')
}

type Status = 'idle' | 'running' | 'done'
type Mode   = 'time' | 'words' | 'quote' | 'zen' | 'custom'
interface Result {
  wpm: number; rawWpm: number; accuracy: number; consistency: number
  duration: number; correct: number; incorrect: number; chars: number
}

// Continuous modes keep generating fresh passages as the user finishes each one;
// the rest are a single fixed passage that ends the test on completion.
const CONTINUOUS_MODES: Mode[] = ['time', 'zen']

function textFor(mode: Mode, punctuation: boolean, numbers: boolean, wordCount: number, customText: string): string {
  switch (mode) {
    case 'words':  return buildText(punctuation, numbers, wordCount)
    case 'quote':  return QUOTE_BANK[Math.floor(Math.random() * QUOTE_BANK.length)]
    case 'custom': return customText || buildText(punctuation, numbers)
    default:       return buildText(punctuation, numbers)
  }
}

export default function TestPage() {
  const [duration,    setDuration]    = useState(30)
  const [punctuation, setPunctuation] = useState(false)
  const [numbers,     setNumbers]     = useState(false)
  const [mode,       setMode]       = useState<Mode>('time')
  const [wordCount,  setWordCount]  = useState(25)
  const [customText, setCustomText] = useState('')
  const [customOpen,  setCustomOpen]  = useState(false)
  const [customDraft, setCustomDraft] = useState('')
  const [customTimeOpen,  setCustomTimeOpen]  = useState(false)
  const [customTimeDraft, setCustomTimeDraft] = useState('')
  const [text,     setText]     = useState('')
  const [typed,    setTyped]    = useState('')
  const [status,   setStatus]   = useState<Status>('idle')
  const [timeLeft, setTimeLeft] = useState(duration)
  const [elapsedSec, setElapsedSec] = useState(0)
  const [result,   setResult]   = useState<Result | null>(null)
  const [shared,    setShared]    = useState(false)
  const [caret,    setCaret]    = useState({ top: 0, left: 0, height: 0 })
  const [scroll,   setScroll]   = useState({ lineHeight: 0, offset: 0 })

  const inputEl     = useRef<HTMLInputElement>(null)
  const typedRef    = useRef('')
  const textRef     = useRef('')
  const startRef    = useRef(0)
  const timerRef    = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const doneRef     = useRef(false)
  const samplesRef  = useRef<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const charRefs    = useRef<Array<HTMLSpanElement | null>>([])
  const correctedRef = useRef<Set<number>>(new Set())
  const totalCharsRef  = useRef(0)
  const totalErrorsRef = useRef(0)      // every position ever mistyped (→ accuracy & error count)
  const totalFinalErrorsRef = useRef(0) // positions still wrong at the end (→ excluded from speed)

  useEffect(() => {
    const t = textFor(mode, punctuation, numbers, wordCount, customText)
    setText(t); textRef.current = t
    setTimeout(() => inputEl.current?.focus(), 100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function computeResult(durSec: number): Result {
    const t = typedRef.current
    // Mistakes still wrong at the very end — these don't count toward speed.
    const pageFinalErr = t.split('').filter((c, i) => c !== textRef.current[i]).length
    // Every position ever mistyped — counts against accuracy even once corrected.
    const pageEverErr  = correctedRef.current.size

    const chars       = totalCharsRef.current + t.length
    const finalErrors = totalFinalErrorsRef.current + pageFinalErr
    const everErrors  = totalErrorsRef.current + pageEverErr

    // One shared pipeline for Standard / Custom / Lesson tests.
    const s = calculateStats({ totalChars: chars, finalErrors, everErrors, durationSec: durSec, samples: samplesRef.current })

    if (process.env.NODE_ENV !== 'production') {
      console.log('[typingjon] test result', {
        mode, text: textRef.current,
        totalCharacters: s.chars, correctCharacters: s.correct, incorrectCharacters: s.incorrect,
        startTime: startRef.current, endTime: Math.round(startRef.current + durSec * 1000),
        elapsedTimeMs: Math.round(durSec * 1000), elapsedMinutes: Math.max(durSec, 0.3) / 60,
        wpm: s.wpm, rawWpm: s.rawWpm, accuracy: s.accuracy, consistency: s.consistency,
      })
    }

    return {
      wpm: s.wpm, rawWpm: s.rawWpm, accuracy: s.accuracy, consistency: s.consistency,
      duration: Math.round(durSec), correct: s.correct, incorrect: s.incorrect, chars: s.chars,
    }
  }

  function finish(durSec: number) {
    if (doneRef.current) return
    doneRef.current = true
    clearInterval(timerRef.current)
    const res = computeResult(durSec)
    setStatus('done')
    setResult(res)

    if (res.duration >= 1) {
      fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wpm: res.wpm, accuracy: res.accuracy, duration: res.duration }),
      }).catch(() => {})
    }
  }

  // 1-second tick — counts down for 'time' mode (and finishes on zero), counts
  // up elsewhere for display, and always samples instantaneous WPM for consistency
  useEffect(() => {
    if (status !== 'running') return
    timerRef.current = setInterval(() => {
      const secs = (Date.now() - startRef.current) / 1000
      samplesRef.current.push(Math.round((typedRef.current.length / 5) / Math.max(secs / 60, 0.001)))

      if (mode === 'time') {
        setTimeLeft(t => {
          if (t <= 1) {
            finish((Date.now() - startRef.current) / 1000)
            return 0
          }
          return t - 1
        })
      } else {
        setElapsedSec(Math.floor(secs))
      }
    }, 1000)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, mode])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (status === 'done') return
    const raw = e.target.value

    if (status === 'idle') {
      setStatus('running')
      startRef.current = Date.now()
    }

    const val = raw.slice(0, textRef.current.length)

    // Remember any index that was ever mistyped — even once corrected, it's shown as "fixed"
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== textRef.current[i]) correctedRef.current.add(i)
    }

    setTyped(val); typedRef.current = val

    // Passage complete — handled synchronously, right here, instead of in a
    // useEffect keyed on `typed`/`text`. A passive effect commits one tick
    // after this handler returns, and on fast typing the next keystroke can
    // land in that gap: it would read the still-stale textRef/typedRef and
    // (worse) the DOM <input> would still hold the just-finished passage's
    // text, so `raw` mixes old and new content and gets compared against the
    // wrong target — producing nonsensical "more errors than characters typed".
    // Doing the bank-and-swap inline, plus force-clearing the DOM value below,
    // closes that race window entirely.
    if (textRef.current.length > 0 && val.length === textRef.current.length) {
      if (CONTINUOUS_MODES.includes(mode)) {
        totalCharsRef.current       += val.length
        totalErrorsRef.current      += correctedRef.current.size
        totalFinalErrorsRef.current += val.split('').filter((c, i) => c !== textRef.current[i]).length

        const next = textFor(mode, punctuation, numbers, wordCount, customText)
        textRef.current  = next
        typedRef.current = ''
        correctedRef.current = new Set()
        e.target.value = ''
        setText(next)
        setTyped('')
      } else {
        finish((Date.now() - startRef.current) / 1000)
      }
    }
  }

  function restart(opts?: {
    duration?: number; punctuation?: boolean; numbers?: boolean; sameText?: boolean
    mode?: Mode; wordCount?: number; customText?: string
  }) {
    clearInterval(timerRef.current)
    doneRef.current = false
    samplesRef.current = []
    correctedRef.current = new Set()
    totalCharsRef.current  = 0
    totalErrorsRef.current = 0
    totalFinalErrorsRef.current = 0
    setShared(false)
    const punct = opts?.punctuation ?? punctuation
    const nums  = opts?.numbers ?? numbers
    const m     = opts?.mode ?? mode
    const wc    = opts?.wordCount ?? wordCount
    const ct    = opts?.customText ?? customText
    const t = opts?.sameText ? textRef.current : textFor(m, punct, nums, wc, ct)
    setText(t); textRef.current = t
    setTyped('');  typedRef.current = ''
    setMode(m)
    if (opts?.wordCount   !== undefined) setWordCount(opts.wordCount)
    if (opts?.customText  !== undefined) setCustomText(opts.customText)
    const d = opts?.duration ?? duration
    setStatus('idle'); setTimeLeft(d); setElapsedSec(0)
    setResult(null)
    startRef.current = 0
    setTimeout(() => inputEl.current?.focus(), 50)
  }

  function selectMode(m: Mode) {
    if (m === 'custom') { setCustomDraft(customText); setCustomOpen(true); return }
    if (m === mode) return
    restart({ mode: m })
  }

  function selectWordCount(w: number) {
    if (w === wordCount && mode === 'words') return
    restart({ mode: 'words', wordCount: w })
  }

  const CUSTOM_MIN = 3
  function applyCustomText() {
    const trimmed = customDraft.trim()
    // At least 3 characters — letters, digits or symbols all count.
    if (trimmed.length < CUSTOM_MIN) return
    setCustomOpen(false)
    restart({ mode: 'custom', customText: trimmed })
  }

  function applyCustomTime() {
    const secs = Math.min(Math.max(Math.round(Number(customTimeDraft)), 5), 3600)
    if (!Number.isFinite(secs) || secs < 5) return
    setCustomTimeOpen(false)
    setDuration(secs)
    restart({ mode: 'time', duration: secs, sameText: true })
  }

  function selectDuration(d: number) {
    if (d === duration && mode === 'time') return
    setDuration(d)
    restart({ mode: 'time', duration: d, sameText: true })
  }

  function togglePunctuation() {
    const next = !punctuation
    setPunctuation(next)
    restart({ punctuation: next })
  }

  function toggleNumbers() {
    const next = !numbers
    setNumbers(next)
    restart({ numbers: next })
  }

  async function shareResult() {
    if (!result) return
    const msg = `Men Typingjon'da ${result.wpm} WPM va ${result.accuracy}% aniqlik bilan yozdim! ⌨️`
    try {
      await navigator.clipboard.writeText(msg)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    } catch {}
  }

  // tab + enter → restart; escape → finish now (zen mode has no natural end point)
  const restartRef = useRef(restart)
  restartRef.current = restart
  const finishRef = useRef(finish)
  finishRef.current = finish
  const tabPressedRef = useRef(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // While a settings editor (custom text / custom time) is open, leave the
      // keyboard alone so the user can type into its field — otherwise the
      // focus-steal below yanks focus back to the hidden test input.
      if (customOpen || customTimeOpen) return
      if (e.key === 'Tab') {
        e.preventDefault()
        tabPressedRef.current = true
      } else if (e.key === 'Enter' && tabPressedRef.current) {
        e.preventDefault()
        tabPressedRef.current = false
        restartRef.current()
      } else if (e.key === 'Escape') {
        // ESC restarts the test — except in (endless) zen, where it ends it.
        e.preventDefault()
        if (mode === 'zen' && status === 'running') {
          finishRef.current((Date.now() - startRef.current) / 1000)
        } else {
          restartRef.current()
        }
      } else {
        tabPressedRef.current = false
        // Any printable key — make sure the hidden input is focused so the
        // onChange fires even if the user never explicitly clicked the page
        if (
          e.key.length === 1 &&
          !e.ctrlKey && !e.metaKey && !e.altKey &&
          status !== 'done' &&
          document.activeElement !== inputEl.current
        ) {
          inputEl.current?.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mode, status, customOpen, customTimeOpen])

  // Live stats — accumulated across finished 3-line passages plus the current one in progress
  const elapsedMin   = startRef.current ? (Date.now() - startRef.current) / 60_000 : 0
  // Errors ever made (→ accuracy & count) vs. errors still wrong now (→ excluded from speed)
  const pageEver     = correctedRef.current.size
  const pageFinal    = typed.split('').filter((c, i) => c !== text[i]).length
  const liveChars    = totalCharsRef.current + typed.length
  const liveEver     = totalErrorsRef.current + pageEver
  const liveFinal    = totalFinalErrorsRef.current + pageFinal
  const liveCorrect  = Math.max(liveChars - liveFinal, 0)
  // Live WPM keeps a small floor so it doesn't spike to 999 in the first second.
  const liveWpm      = status === 'running' && elapsedMin > 0 ? Math.round((liveCorrect / 5) / Math.max(elapsedMin, 0.02)) : 0
  const liveAcc      = liveChars > 0 ? Math.round(((liveChars - liveEver) / liveChars) * 100) : 100

  type CharState = 'correct' | 'wrong' | 'pending'
  const chars: { ch: string; state: CharState }[] = text.split('').map((ch, i) => ({
    ch,
    // Correct (incl. corrected) → normal dark; wrong → red; upcoming → light grey.
    state: i < typed.length ? (typed[i] === ch ? 'correct' : 'wrong') : 'pending',
  }))

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

    // Keep exactly 3 lines in view — scroll the passage up one line at a time
    // as the caret advances, so finished lines roll off and new ones appear.
    const lineHeight = parseFloat(getComputedStyle(container).lineHeight) || elRect.height
    const lineIndex  = lineHeight > 0 ? Math.round(top / lineHeight) : 0
    setScroll({ lineHeight, offset: lineIndex * lineHeight })
  }, [typed, text, status])

  const displayTime = mode === 'time' ? `${timeLeft}s` : `${elapsedSec}s`

  return (
    <div
      className="mx-auto flex h-full w-full max-w-[1180px] flex-col items-center justify-center gap-7 overflow-hidden px-6 py-6"
      onClick={() => inputEl.current?.focus()}
    >
      {/* Mode bar — fades out of the way while typing to keep the focus on the text */}
      <div className={`flex flex-col items-center gap-3 transition-opacity duration-300 ${
        status === 'running' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}>
        <div className="flex flex-wrap items-center justify-center gap-3">

          {/* Punctuation & numbers toggles */}
          <div className="flex items-center gap-1 rounded-full bg-slate-100/70 p-1.5 dark:bg-slate-800/60">
            <button onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); togglePunctuation() }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                punctuation ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
              }`}>
              <AtSign className="h-3.5 w-3.5" />
              tinish belgilari
            </button>
            <button onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); toggleNumbers() }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                numbers ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
              }`}>
              <Hash className="h-3.5 w-3.5" />
              raqamlar
            </button>
          </div>

          {/* Mode tabs */}
          <div className="flex items-center gap-1 rounded-full bg-slate-100/70 p-1.5 dark:bg-slate-800/60">
            {[
              { key: 'time'   as Mode, icon: Clock,    label: 'vaqt'    },
              { key: 'words'  as Mode, icon: Type,     label: "so'zlar" },
              { key: 'quote'  as Mode, icon: Quote,    label: 'iqtibos' },
              { key: 'zen'    as Mode, icon: Triangle, label: 'zen'     },
              { key: 'custom' as Mode, icon: Wrench,   label: 'maxsus'  },
            ].map(({ key, icon: Icon, label }) => (
              <button key={key} onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); selectMode(key) }}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                  mode === key ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`}>
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Mode-specific options + settings */}
          <div className="flex items-center gap-1 rounded-full bg-slate-100/70 p-1.5 dark:bg-slate-800/60">
            {mode === 'time' && DURATIONS.map(d => (
              <button key={d} onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); selectDuration(d) }}
                className={`rounded-full px-3.5 py-1.5 font-mono text-sm font-bold transition-colors ${
                  duration === d ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`}>
                {d}
              </button>
            ))}
            {mode === 'time' && (
              <button onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); setCustomTimeDraft(DURATIONS.includes(duration) ? '' : String(duration)); setCustomTimeOpen(true) }}
                className={`flex items-center gap-1 rounded-full px-3.5 py-1.5 font-mono text-sm font-bold transition-colors ${
                  !DURATIONS.includes(duration) ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`}>
                {DURATIONS.includes(duration) ? <Wrench className="h-3.5 w-3.5" /> : `${duration}`}
              </button>
            )}
            {mode === 'words' && WORD_COUNTS.map(w => (
              <button key={w} onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); selectWordCount(w) }}
                className={`rounded-full px-3.5 py-1.5 font-mono text-sm font-bold transition-colors ${
                  wordCount === w ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`}>
                {w}
              </button>
            ))}
            {mode === 'quote' && (
              <span className="px-3.5 py-1.5 font-sans text-xs font-semibold text-slate-400">tasodifiy iqtibos</span>
            )}
            {mode === 'zen' && (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 font-sans text-xs font-semibold text-slate-400">
                cheksiz —
                <kbd className="rounded-md border border-slate-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-400 dark:border-slate-700">esc</kbd>
                bilan tugating
              </span>
            )}
            {mode === 'custom' && (
              <button onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); setCustomDraft(customText); setCustomOpen(true) }}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-50">
                <Wrench className="h-3.5 w-3.5" />
                matnni tahrirlash
              </button>
            )}
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <Globe className="h-3.5 w-3.5" />
          english
        </span>
      </div>

      {/* Live stats — minimal, real-time WPM / Accuracy / Time */}
      <div className={`flex items-center justify-center gap-7 font-mono text-sm tabular-nums transition-opacity duration-300 sm:gap-10 ${
        status === 'done' ? 'opacity-0' : 'opacity-100'
      }`}>
        <span className="flex items-baseline gap-1.5">
          <span className="text-lg font-extrabold text-blue-600">{liveWpm}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">wpm</span>
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className="text-lg font-extrabold text-slate-700 dark:text-slate-200">{liveAcc}%</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">aniqlik</span>
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className={`text-lg font-extrabold ${status === 'running' && mode === 'time' && timeLeft <= 10 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200'}`}>{displayTime}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">vaqt</span>
        </span>
      </div>

      {/* Hidden input — must live OUTSIDE the overflow:hidden typing box so   */}
      {/* sr-only's margin:-1px doesn't get clipped, allowing focus to work.   */}
      <input
        ref={inputEl}
        value={typed}
        onChange={handleChange}
        disabled={status === 'done'}
        className="sr-only"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Matn kiriting"
      />

      {/* Typing area — borderless, clipped to 3 lines; the passage scrolls as you type */}
      <div className={`w-full max-w-4xl transition-opacity duration-300 ${status === 'done' ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
        <div
          className="relative overflow-hidden"
          style={scroll.lineHeight ? { height: scroll.lineHeight * 3 } : undefined}
        >
          <div
            ref={containerRef}
            className="relative z-10 cursor-text select-none text-left font-mono text-[28px] leading-[1.7] tracking-wide text-slate-300 dark:text-slate-600 sm:text-[32px] lg:text-[34px]"
            style={{ transform: `translateY(-${scroll.offset}px)`, transition: 'transform 200ms ease' }}
          >
            {chars.map(({ ch, state }, i) => (
              <span key={i}
                ref={(el) => { charRefs.current[i] = el }}
                className={`rounded-[3px] transition-colors duration-100 ${
                  state === 'correct' ? 'text-slate-800 dark:text-slate-100' :
                  state === 'wrong'   ? 'bg-rose-100 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400' :
                                        'text-slate-300 dark:text-slate-600'
                }`}>{ch}</span>
            ))}
            {/* Smooth sliding caret */}
            <span
              className="tj-caret absolute rounded-full"
              style={{ top: caret.top, left: caret.left, height: caret.height || '1em', transition: 'top 100ms ease, left 100ms ease' }}
            />
          </div>
        </div>
      </div>

      {/* Restart + shortcut hint */}
      <div className={`flex flex-col items-center gap-3 transition-opacity duration-300 ${status === 'done' ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
        <button onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); restart() }}
          aria-label="Qayta boshlash"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-50 hover:text-slate-500 dark:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-400">
          <RotateCcw className="h-5 w-5" />
        </button>
        <span className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-300 dark:text-slate-600">
          <kbd className="rounded-md border border-slate-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-400 dark:border-slate-700">tab</kbd>
          <span>fokus</span>
          <span className="mx-1 text-slate-200 dark:text-slate-700">·</span>
          <kbd className="rounded-md border border-slate-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-400 dark:border-slate-700">esc</kbd>
          <span>— qayta boshlash</span>
        </span>
      </div>

      {/* Result modal */}
      {status === 'done' && result && (() => {
        const tier = result.wpm >= 80 ? 'great' : result.wpm >= 50 ? 'good' : 'ok'
        const modeLabel = mode === 'time' ? `Vaqt · ${duration}s` : mode === 'words' ? `So'zlar · ${wordCount}`
          : mode === 'quote' ? 'Iqtibos' : mode === 'zen' ? 'Zen' : 'Maxsus'
        const durLabel = `${result.duration}s`
        const tooShort = result.chars < 10
        const stats = [
          { label: 'Aniqlik',     value: `${result.accuracy}%`,    icon: Target,        color: 'text-blue-600',    bg: 'bg-blue-50' },
          { label: 'Raw WPM',     value: `${result.rawWpm}`,       icon: Zap,           color: 'text-indigo-600',  bg: 'bg-indigo-50' },
          { label: 'Barqarorlik', value: `${result.consistency}%`, icon: TrendingUp,    color: 'text-violet-600',  bg: 'bg-violet-50' },
          { label: "To'g'ri",     value: `${result.correct}`,      icon: Check,         color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Xato',        value: `${result.incorrect}`,    icon: AlertTriangle, color: 'text-rose-600',    bg: 'bg-rose-50' },
          { label: 'Davomiylik',  value: durLabel,                 icon: Clock,         color: 'text-slate-600',   bg: 'bg-slate-100' },
        ]
        return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/20 p-6 backdrop-blur-sm"
          onClick={(e) => { e.stopPropagation(); restart() }}
        >
          <div
            className="tj-reveal tj-visible my-auto w-full max-w-md rounded-[1.75rem] bg-gradient-to-br from-blue-200/70 via-white to-indigo-200/60 p-[1px] shadow-[0_24px_70px_-20px_rgba(15,23,42,0.35)] dark:from-blue-900/50 dark:via-slate-900 dark:to-indigo-900/50"
            onClick={(e) => e.stopPropagation()}
          >
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
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {tier === 'great' ? 'Ajoyib natija!' : tier === 'good' ? 'Yaxshi natija!' : 'Davom eting!'}
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{modeLabel}</p>
                </div>
              </div>

              {/* Hero — Tezlik (WPM) stands out on its own */}
              <div className="mt-5 px-7">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/60 to-white px-6 py-6 text-center ring-1 ring-blue-100/70 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900 dark:ring-blue-900/40">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-200/30 blur-2xl" />
                  <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-400">Tezlik · WPM</div>
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text font-mono text-7xl font-extrabold leading-none tracking-tight text-transparent sm:text-8xl">
                    {result.wpm}
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="mt-4 grid grid-cols-3 gap-2.5 px-7">
                {stats.map(s => (
                  <div key={s.label} className="rounded-xl border border-slate-100 bg-white px-2 py-3 text-center shadow-[0_2px_8px_-4px_rgba(15,23,42,0.1)] dark:border-slate-800 dark:bg-slate-800/40">
                    <div className={`mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg ${s.bg} dark:bg-slate-800`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                    <div className="font-mono text-lg font-bold tabular-nums text-slate-900 dark:text-white">{s.value}</div>
                    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Too-short notice */}
              {tooShort && (
                <div className="mt-3 px-7">
                  <div className="flex w-full items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                    <p className="text-[11px] font-medium leading-snug text-amber-700">
                      Matn juda qisqa — aniqroq natija uchun uzunroq matn yozing.
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-2.5 px-7 pb-7">
                <div className="flex gap-2.5">
                  <button onClick={() => restart({ sameText: true })}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                    <RotateCcw className="h-4 w-4" />
                    Qayta urinish
                  </button>
                  <button onClick={() => restart()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/40">
                    Yangi test
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={shareResult}
                  className="flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                  {shared ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                  {shared ? 'Nusxalandi!' : 'Ulashish'}
                </button>
              </div>
            </div>
          </div>
        </div>
        )
      })()}

      {/* Custom-text modal */}
      {customOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 p-6 backdrop-blur-[2px] dark:bg-slate-950/50"
          onClick={(e) => { e.stopPropagation(); setCustomOpen(false) }}
        >
          <div
            className="tj-reveal tj-visible w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40">
                <Wrench className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">O&apos;z matningiz</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">Kamida 3 ta belgi — harf, raqam yoki belgi</p>
              </div>
            </div>

            <textarea
              value={customDraft}
              onChange={(e) => setCustomDraft(e.target.value)}
              rows={5}
              placeholder="Matningizni shu yerga yozing yoki joylashtiring..."
              className="mt-4 w-full resize-none rounded-xl border border-slate-200 p-3 font-mono text-sm text-slate-700 outline-none transition-colors focus:border-blue-300 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:focus:border-blue-700"
            />

            <div className="mt-1.5 flex justify-end">
              <span className={`text-[11px] font-semibold ${customDraft.trim().length < CUSTOM_MIN ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {customDraft.trim().length} / kamida {CUSTOM_MIN}
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <button onClick={() => setCustomOpen(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Bekor qilish
              </button>
              <button onClick={applyCustomText} disabled={customDraft.trim().length < CUSTOM_MIN}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40">
                Boshlash
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom-time modal */}
      {customTimeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 p-6 backdrop-blur-[2px] dark:bg-slate-950/50"
          onClick={(e) => { e.stopPropagation(); setCustomTimeOpen(false) }}
        >
          <div
            className="tj-reveal tj-visible w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Maxsus vaqt</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">Soniyada kiriting (5–3600)</p>
              </div>
            </div>

            <div className="relative mt-4">
              <input
                type="number"
                min={5}
                max={3600}
                autoFocus
                value={customTimeDraft}
                onChange={(e) => setCustomTimeDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') applyCustomTime() }}
                placeholder="masalan: 45"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-14 font-mono text-lg font-bold text-slate-700 outline-none transition-colors focus:border-blue-300 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:focus:border-blue-700"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 dark:text-slate-500">soniya</span>
            </div>

            {/* Quick picks */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[45, 90, 180, 300, 600].map(s => (
                <button key={s} onClick={() => setCustomTimeDraft(String(s))}
                  className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-400">
                  {s}s
                </button>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <button onClick={() => setCustomTimeOpen(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Bekor qilish
              </button>
              <button onClick={applyCustomTime} disabled={!(Math.round(Number(customTimeDraft)) >= 5)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40">
                Boshlash
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
