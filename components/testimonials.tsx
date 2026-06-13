﻿import { Star, Quote } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { GlassCard } from '@/components/glass-card'

const testimonials = [
  {
    quote: "Typingjon tufayli yozish tezligim 30 kunda ikki baravar oshdi. Har kuni mashq qilish odat bo'lib qoldi!",
    name: 'Jasur Mirzayev',
    role: 'Talaba',
    initials: 'JM',
    color: 'from-blue-500 to-blue-600',
    result: '2x tezlik',
  },
  {
    quote: "Dasturchi sifatida vaqtimni tejamoqchi edim. Typingjon menga eng yaxshi platforma bo'ldi — real vaqt tahlili ajoyib.",
    name: 'Nilufar Rahimova',
    role: 'Dasturchi',
    initials: 'NR',
    color: 'from-violet-500 to-violet-600',
    result: '30 kun seriya',
  },
  {
    quote: "Frilanser uchun tezlik juda muhim. Endi mijozlarimga ikki baravar tez javob bera olaman. Tavsiya qilaman!",
    name: 'Bobur Xasanov',
    role: 'Frilanser',
    initials: 'BX',
    color: 'from-cyan-500 to-cyan-600',
    result: '98% aniqlik',
  },
]

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-primary">
            Fikrlar
          </span>
          <h2 className="mt-5 font-sans text-2xl font-bold sm:text-3xl tracking-tight text-foreground sm:text-4xl">
            Foydalanuvchilar{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              nima deydi
            </span>
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
            Minglab foydalanuvchilar Typingjon orqali o&apos;z natijalarini ikki barobarga oshirdi.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <GlassCard className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors duration-300 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10 sm:p-7">
              <figure className="flex h-full flex-col">

                {/* top accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* quote icon */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-primary/10" />
                </div>

                {/* quote text */}
                <blockquote className="flex-1 font-sans text-sm leading-relaxed text-slate-600">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* result badge */}
                <div className="mt-5">
                  <span className={`inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 font-sans text-xs font-semibold text-white ${t.color}`}>
                    → {t.result}
                  </span>
                </div>

                {/* author */}
                <figcaption className="mt-4 flex items-center gap-3 border-t border-border/60 pt-4">
                  <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-sans text-sm font-bold text-white ${t.color}`}>
                    {t.initials[0]}
                  </span>
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="font-sans text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}


