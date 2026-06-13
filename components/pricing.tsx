import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'
import { GlassCard } from '@/components/glass-card'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Bepul',
    price: '0',
    currency: "so'm",
    period: 'doim bepul',
    desc: "Boshlash uchun zarur bo'lgan hamma narsa.",
    features: ['Asosiy darslar', 'Statistika', 'Hamjamiyatga kirish'],
    cta: 'Bepul boshlash',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '79,000',
    currency: "so'm",
    period: 'oyiga',
    desc: "Jiddiy foydalanuvchilar uchun to'liq imkoniyat.",
    features: [
      'Cheksiz darslar',
      'Batafsil tahlil',
      'Sertifikatlar',
      'Musobaqalar',
      'Ustuvor yordam',
    ],
    cta: "Pro'ga o'tish",
    highlight: true,
  },
]

export function Pricing() {
  return (
    <section id="narxlar" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-primary">
            Narxlar
          </span>
          <h2 className="mt-5 font-sans text-2xl font-bold sm:text-3xl tracking-tight text-foreground sm:text-4xl">
            Oddiy va{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              shaffof narxlar
            </span>
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
            Bepul boshlang va tayyor bo&apos;lganingizda yangi darajaga o&apos;ting.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-3xl gap-5 md:grid-cols-2">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 100}>
              <GlassCard
                intensity={8}
                className={cn(
                'group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-colors duration-300 sm:p-8',
                plan.highlight
                  ? 'border-primary/60 bg-card shadow-2xl shadow-primary/15 hover:shadow-primary/25'
                  : 'border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8',
              )}>

                {/* background glow for pro */}
                {plan.highlight && (
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-blue-600/5" />
                )}

                {/* top line */}
                {plan.highlight && (
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-blue-400 to-primary" />
                )}

                {/* badge */}
                {plan.highlight && (
                  <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
                    <Zap className="h-3 w-3 text-primary" />
                    <span className="font-sans text-xs font-semibold text-primary">Eng mashhur</span>
                  </div>
                )}

                {/* plan name */}
                <h3 className="font-sans text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1 font-sans text-sm text-muted-foreground">{plan.desc}</p>

                {/* price */}
                <div className="mt-6 flex items-end gap-1">
                  <span className="font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {plan.price}
                  </span>
                  <span className="mb-1 font-sans text-base font-medium text-muted-foreground">
                    {plan.currency}
                  </span>
                  <span className="mb-1 font-sans text-sm text-muted-foreground">
                    /{plan.period}
                  </span>
                </div>

                {/* divider */}
                <div className="my-6 h-px bg-border" />

                {/* features */}
                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span className={cn(
                        'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
                        plan.highlight ? 'bg-primary text-white' : 'bg-primary/10 text-primary',
                      )}>
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="font-sans text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* cta */}
                <a
                  href="/register"
                  className={cn(
                    'mt-8 inline-flex h-auto w-full items-center justify-center rounded-xl py-3 font-sans text-sm font-semibold transition-all duration-200',
                    plan.highlight
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/40 hover:scale-[1.02]'
                      : 'border border-border bg-transparent text-foreground hover:bg-muted',
                  )}
                >
                  {plan.cta}
                </a>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}


