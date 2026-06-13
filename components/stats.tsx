'use client'

import { useEffect, useRef, useState } from 'react'
import { BookOpen, Users, Target, PenLine, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/glass-card'
import { Reveal } from '@/components/reveal'

const stats = [
  { display: 100, suffix: 'K+', label: 'Yakunlangan darslar', icon: BookOpen, trend: '+12%' },
  { display: 25,  suffix: 'K+', label: 'Faol foydalanuvchilar', icon: Users,    trend: '+8%'  },
  { display: 98,  suffix: '%',  label: 'Aniqlik oshishi',       icon: Target,   trend: '+3%'  },
  { display: 1,   suffix: 'M+', label: "Yozilgan so'zlar",      icon: PenLine,  trend: '+24%' },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function runCounter() {
      if (started.current) return
      started.current = true
      const duration = 1400
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(target * eased))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    // Back/forward → run counter immediately
    try {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      if (nav?.type === 'back_forward') { runCounter(); return }
    } catch { /* ignore */ }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { runCounter(); observer.disconnect() }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="tabular-nums">
      {value}<span className="text-primary">{suffix}</span>
    </span>
  )
}

export function Stats() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, display, suffix, icon: Icon, trend }, i) => (
              <GlassCard
                key={label}
                intensity={6}
                className={cn(
                  'group relative flex flex-col items-center px-4 py-6 text-center transition-colors duration-200 hover:bg-muted/30 sm:px-6 sm:py-8 lg:px-8 lg:py-10',
                  i % 2 === 0 && i !== stats.length - 1 && 'border-r border-border lg:border-r',
                  i === 1 && 'border-r-0 lg:border-r lg:border-border',
                  i < 2 && 'border-b border-border lg:border-b-0',
                  i === 2 && 'border-r border-border lg:border-r',
                )}
              >
                {/* icon */}
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-primary/8 transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/30 sm:mb-5 sm:h-11 sm:w-11">
                  <Icon className="h-4 w-4 text-primary transition-all duration-300 group-hover:text-white group-hover:scale-110 sm:h-5 sm:w-5" />
                </div>

                {/* number */}
                <p className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  <Counter target={display} suffix={suffix} />
                </p>

                {/* label */}
                <p className="mt-1.5 font-sans text-xs text-muted-foreground sm:mt-2 sm:text-sm">{label}</p>

                {/* trend badge */}
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600 sm:mt-4 sm:px-2.5 sm:py-1">
                  <TrendingUp className="h-3 w-3" />
                  {trend}
                </div>
              </GlassCard>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}


