'use client'

import { useEffect, useRef, useState } from 'react'
import { Zap, Target, Award, Activity } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

const CHART_BARS = [40, 55, 48, 70, 62, 85, 78, 92, 88, 95]
const TYPING_TEXT = "mashq qilish mahoratni oshiradi"

function useCounter(target: number, active: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    const duration = 1400
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * e))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target])
  return val
}

function Metric({ icon: Icon, label, target, suffix, trend, active, up = true }: {
  icon: React.ElementType
  label: string
  target: number
  suffix: string
  trend: string
  active: boolean
  up?: boolean
}) {
  const val = useCounter(target, active)
  return (
    <div className="bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="font-sans text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-3 font-sans text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
        {val.toLocaleString()}{suffix}
      </p>
      <p className={cn('mt-1 font-sans text-xs font-medium', up ? 'text-emerald-500' : 'text-primary')}>
        {trend}
      </p>
    </div>
  )
}

function TypingPreview({ active }: { active: boolean }) {
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current) return
    started.current = true
    let waiting = false
    const id = setInterval(() => {
      if (waiting) return
      setCount((c) => {
        if (c >= TYPING_TEXT.length) {
          waiting = true
          setTimeout(() => { waiting = false; setCount(0) }, 1500)
          return c
        }
        return c + 1
      })
    }, 80)
    return () => clearInterval(id)
  }, [active])

  const typed = TYPING_TEXT.slice(0, count)
  const rest = TYPING_TEXT.slice(count)

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="font-mono text-sm leading-relaxed">
        <span className="text-foreground">{typed}</span>
        <span className="tj-caret h-4" />
        <span className="text-muted-foreground/40">{rest}</span>
      </p>
    </div>
  )
}

export function Showcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    // Back/forward → activate immediately
    try {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      if (nav?.type === 'back_forward') { setActive(true); return }
    } catch { /* ignore */ }

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="vitrina" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-primary">
            Mahsulot
          </span>
          <h2 className="mt-5 font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Shaxsiy boshqaruv panelingiz —{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              yangi ko&apos;rinishda
            </span>
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
            Har bir sessiyani natijaga aylantiruvchi sof va qulay ish muhiti.
          </p>
        </Reveal>

        <div ref={sectionRef} className="relative mt-12 sm:mt-14">
          <div className="absolute -inset-x-10 -top-10 -z-10 h-72 rounded-full bg-secondary/10 blur-3xl" />

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 sm:rounded-3xl">

            {/* browser chrome */}
            <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5 sm:px-5 sm:py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80 sm:h-3 sm:w-3" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 sm:h-3 sm:w-3" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/80 sm:h-3 sm:w-3" />
              </div>
              <div className="flex flex-1 items-center justify-center">
                <div className="flex items-center gap-2 rounded-md border border-border/60 bg-background/60 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="font-mono text-xs text-muted-foreground">
                    typingjon.uz/dashboard
                  </span>
                </div>
              </div>
              <span className="w-10 sm:w-14" />
            </div>

            {/* metrics */}
            <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
              <Metric icon={Zap}    label="Jonli tezlik (WPM)" target={87}   suffix=""  trend="↑ +12 bu hafta" active={active} />
              <Metric icon={Target} label="Aniqlik"             target={98}   suffix="%" trend="↑ +3% bu hafta" active={active} />
              <Metric icon={Award}  label="Olingan XP"          target={4820} suffix=""  trend="12-daraja"      active={active} up={false} />
            </div>

            {/* chart + lesson */}
            <div className="grid gap-px bg-border lg:grid-cols-3">
              <div className="bg-card p-4 sm:p-6 lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="font-sans text-sm font-semibold text-foreground">
                      Rivojlanish grafigi
                    </span>
                  </div>
                  <span className="hidden rounded-full bg-muted px-2.5 py-1 font-sans text-xs text-muted-foreground sm:inline">
                    So&apos;nggi 10 sessiya
                  </span>
                </div>
                <div className="flex h-28 items-end gap-1 sm:h-36 md:h-44">
                  {CHART_BARS.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-primary to-blue-400 transition-all ease-out hover:from-primary/80 hover:to-blue-300"
                      style={{
                        height: active ? `${h}%` : '4px',
                        transitionDuration: '700ms',
                        transitionDelay: active ? `${i * 60}ms` : '0ms',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-card p-4 sm:p-6">
                <p className="mb-4 font-sans text-sm font-semibold text-foreground">
                  Joriy dars
                </p>
                <TypingPreview active={active} />
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between font-sans text-xs text-muted-foreground">
                    <span>Dars jarayoni</span>
                    <span className="font-semibold text-primary">72%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-1000 ease-out"
                      style={{ width: active ? '72%' : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
