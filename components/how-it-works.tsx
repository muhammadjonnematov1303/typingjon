'use client'

import { useEffect, useRef, useState } from 'react'
import { UserPlus, BookOpen, CalendarCheck, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/glass-card'
import { Reveal } from '@/components/reveal'

const steps = [
  {
    icon: UserPlus,
    step: 1,
    title: "Ro'yxatdan o'ting",
    desc: "Bir necha soniyada bepul ro'yxatdan o'ting va maqsadlaringizni belgilang.",
    color: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/30',
  },
  {
    icon: BookOpen,
    step: 2,
    title: 'Darslarni bajaring',
    desc: "Tuzilgan, interaktiv yozish darslarini bosqichma-bosqich o'rganing.",
    color: 'from-violet-500 to-violet-600',
    glow: 'shadow-violet-500/30',
  },
  {
    icon: CalendarCheck,
    step: 3,
    title: 'Har kuni mashq qiling',
    desc: "Kunlik seriyalar orqali barmoq xotirasini mustahkamlang.",
    color: 'from-cyan-500 to-cyan-600',
    glow: 'shadow-cyan-500/30',
  },
  {
    icon: Rocket,
    step: 4,
    title: 'Professional darajaga chiqing',
    desc: "O'sishingizni kuzating va tezlik bo'yicha professionalga aylaning.",
    color: 'from-primary to-blue-700',
    glow: 'shadow-primary/30',
  },
]

export function HowItWorks() {
  const lineRef = useRef<HTMLDivElement>(null)
  const [lineVisible, setLineVisible] = useState(false)
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])

  useEffect(() => {
    const el = lineRef.current
    if (!el) return

    // Back/forward → show everything instantly
    try {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      if (nav?.type === 'back_forward') {
        setLineVisible(true)
        setVisibleSteps(steps.map((_, i) => i))
        return
      }
    } catch { /* ignore */ }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLineVisible(true)
          steps.forEach((_, i) => {
            setTimeout(() => setVisibleSteps((v) => [...v, i]), i * 200)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="qanday-ishlaydi" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-primary">
            Qanday ishlaydi?
          </span>
          <h2 className="mt-5 font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            To&apos;rt qadamda{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              noldan professionalga
            </span>
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
            Oddiy va tizimli jarayon orqali yozish tezligingizni ikki barobarga oshiring.
          </p>
        </Reveal>

        {/* steps */}
        <div ref={lineRef} className="relative mt-12 sm:mt-16 lg:mt-20">

          {/* animated connecting line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px overflow-hidden bg-border lg:block">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-primary transition-all duration-[1400ms] ease-out"
              style={{ width: lineVisible ? '100%' : '0%' }}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isVisible = visibleSteps.includes(i)
              return (
                <div
                  key={step.title}
                  className={cn(
                    'group flex flex-col items-center text-center transition-all duration-500',
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
                  )}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  {/* step number badge */}
                  <div className={cn(
                    'relative z-10 flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14 bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110',
                    step.color, step.glow,
                  )}>
                    <Icon className="h-6 w-6" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-bold text-foreground ring-2 ring-border">
                      {step.step}
                    </span>
                  </div>

                  {/* card */}
                  <GlassCard className="mt-6 w-full rounded-2xl border border-border bg-card p-5 transition-colors duration-300 group-hover:border-primary/25 group-hover:shadow-lg group-hover:shadow-primary/8">
                    <h3 className="font-sans text-base font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-slate-500">
                      {step.desc}
                    </p>
                  </GlassCard>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}


