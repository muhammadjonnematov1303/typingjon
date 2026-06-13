'use client'

import { useEffect, useState } from 'react'
import { Play, Keyboard, ArrowRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const TYPE_TEXT = "Tez va to'g'ri yozish — muvaffaqiyat kaliti..."

type Key = { id: string; label: string; flex?: number }

const ROW1: Key[] = [
  { id: '`', label: '`' }, { id: '1', label: '1' }, { id: '2', label: '2' },
  { id: '3', label: '3' }, { id: '4', label: '4' }, { id: '5', label: '5' },
  { id: '6', label: '6' }, { id: '7', label: '7' }, { id: '8', label: '8' },
  { id: '9', label: '9' }, { id: '0', label: '0' }, { id: '-', label: '-' },
  { id: '=', label: '=' }, { id: 'backspace', label: '⌫', flex: 2 },
]
const ROW2: Key[] = [
  { id: 'tab', label: 'tab', flex: 1.5 },
  { id: 'q', label: 'q' }, { id: 'w', label: 'w' }, { id: 'e', label: 'e' },
  { id: 'r', label: 'r' }, { id: 't', label: 't' }, { id: 'y', label: 'y' },
  { id: 'u', label: 'u' }, { id: 'i', label: 'i' }, { id: 'o', label: 'o' },
  { id: 'p', label: 'p' }, { id: '[', label: '[' }, { id: ']', label: ']' },
  { id: '\\', label: '\\', flex: 1.5 },
]
const ROW3: Key[] = [
  { id: 'caps', label: 'caps', flex: 1.75 },
  { id: 'a', label: 'a' }, { id: 's', label: 's' }, { id: 'd', label: 'd' },
  { id: 'f', label: 'f' }, { id: 'g', label: 'g' }, { id: 'h', label: 'h' },
  { id: 'j', label: 'j' }, { id: 'k', label: 'k' }, { id: 'l', label: 'l' },
  { id: ';', label: ';' }, { id: "'", label: "'" },
  { id: 'enter', label: 'enter', flex: 2.25 },
]
const ROW4: Key[] = [
  { id: 'shift', label: 'shift', flex: 2.25 },
  { id: 'z', label: 'z' }, { id: 'x', label: 'x' }, { id: 'c', label: 'c' },
  { id: 'v', label: 'v' }, { id: 'b', label: 'b' }, { id: 'n', label: 'n' },
  { id: 'm', label: 'm' }, { id: ',', label: ',' }, { id: '.', label: '.' },
  { id: '/', label: '/' }, { id: 'shift-r', label: 'shift', flex: 2.75 },
]
const ROW5: Key[] = [
  { id: 'ctrl', label: 'ctrl', flex: 1.5 },
  { id: 'alt', label: 'alt', flex: 1.25 },
  { id: 'space', label: '', flex: 7 },
  { id: 'alt-r', label: 'alt', flex: 1.25 },
  { id: 'ctrl-r', label: 'ctrl', flex: 1.5 },
]
const ROWS = [ROW1, ROW2, ROW3, ROW4, ROW5]

function charToKeyId(char: string): string {
  if (!char) return ''
  const lower = char.toLowerCase()
  if (lower === ' ') return 'space'
  if (lower === '—') return '-'
  return lower
}

function KeyCap({ k, active }: { k: Key; active: boolean }) {
  return (
    <div
      style={{ flex: k.flex ?? 1 }}
      className={cn(
        'flex h-8 min-w-0 items-center justify-center rounded-md border text-[10px] font-mono select-none transition-all duration-75',
        active
          ? 'border-primary bg-primary text-white shadow-lg shadow-primary/40 scale-[0.92] translate-y-px'
          : 'border-border bg-background text-muted-foreground shadow-[0_2px_0_0] shadow-border',
      )}
    >
      {k.label}
    </div>
  )
}

function KeyboardPreview() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let waiting = false
    const interval = setInterval(() => {
      if (waiting) return
      setCount((c) => {
        if (c >= TYPE_TEXT.length) {
          waiting = true
          setTimeout(() => {
            waiting = false
            setCount(0)
          }, 1500)
          return c
        }
        return c + 1
      })
    }, 120)
    return () => clearInterval(interval)
  }, [])

  const activeKeyId = count > 0 ? charToKeyId(TYPE_TEXT[count - 1]) : ''

  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/20 blur-3xl" />

      <div className="relative z-10 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-5 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-border" />
            <span className="h-3 w-3 rounded-full bg-border" />
            <span className="h-3 w-3 rounded-full bg-border" />
          </div>
          <span className="font-mono text-xs text-muted-foreground">1-Dars</span>
        </div>

        <div className="space-y-1.5 bg-muted/30 p-4">
          {ROWS.map((row, i) => (
            <div key={i} className="flex gap-1">
              {row.map((k) => (
                <KeyCap key={k.id} k={k} active={k.id === activeKeyId} />
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="font-mono text-xs text-muted-foreground">Jonli sessiya</span>
          </div>
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-100"
              style={{ width: `${(count / TYPE_TEXT.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage:
              'radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)',
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 md:gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0 text-center lg:text-left">
          <div className="mx-auto inline-flex animate-in fade-in slide-in-from-bottom-4 items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 backdrop-blur-sm duration-700 lg:mx-0">
            <Keyboard className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm font-medium text-primary">Tez O&apos;rgan</span>
            <span className="h-1 w-1 rounded-full bg-primary/40" />
            <span className="font-mono text-sm font-medium text-primary">Aniq Yoz</span>
          </div>

          <h1 className="mt-5 animate-in slide-in-from-bottom-6 font-mono text-2xl font-bold leading-tight tracking-tight text-foreground duration-500 sm:text-3xl md:text-4xl lg:text-5xl">
            Klaviaturada<br />
            Tez va{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              To&apos;g&apos;ri Yozishni
            </span>
            {' '}O&apos;rganing
          </h1>

          <p className="mx-auto mt-4 max-w-md animate-in fade-in slide-in-from-bottom-6 text-pretty text-base leading-relaxed text-muted-foreground duration-700 [animation-delay:200ms] sm:text-lg lg:mx-0">
            Interaktiv darslar, real vaqt statistikasi va qiziqarli mashqlar
            orqali yozish tezligingizni oshiring.
          </p>

          <div className="mt-8 flex animate-in fade-in slide-in-from-bottom-6 flex-col items-center gap-3 duration-700 [animation-delay:300ms] sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="/register"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-primary/40 sm:w-auto"
            >
              Bepul Boshlash
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#vitrina"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background/50 px-8 py-3.5 font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-muted hover:border-primary/30 sm:w-auto"
            >
              <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
              Demo Ko&apos;rish
            </a>
          </div>

          <div className="mt-6 flex animate-in fade-in flex-wrap items-center justify-center gap-x-6 gap-y-2 duration-700 [animation-delay:400ms] lg:justify-start">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Kredit karta talab qilinmaydi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Bepul tarif mavjud</span>
            </div>
          </div>
        </div>

        <div className="hidden animate-in fade-in slide-in-from-right-8 duration-1000 [animation-delay:200ms] lg:block">
          <KeyboardPreview />
        </div>
      </div>
    </section>
  )
}
