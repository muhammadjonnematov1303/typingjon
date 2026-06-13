import { ArrowRight, Play, Zap } from 'lucide-react'
import { Reveal } from '@/components/reveal'

export function FinalCta() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl px-8 py-20 text-center">

        {/* animated gradient background */}
        <div
          className="tj-gradient-animate absolute inset-0 -z-10 rounded-3xl"
          style={{
            background: 'linear-gradient(-45deg, #1d4ed8, #2563eb, #3b82f6, #1e40af, #60a5fa, #2563eb)',
          }}
        />

        {/* top shine */}
        <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
          }}
        />

        {/* glow orbs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

        {/* content */}
        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-yellow-300" />
            <span className="font-sans text-xs font-semibold text-white/90">
              Bugun bepul boshlang
            </span>
          </div>

          <h2 className="font-sans text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Yozish Tezligingizni
            <br />
            <span className="text-blue-200">Bugun Oshiring</span>
          </h2>

          <p className="mx-auto mt-5 max-w-md font-sans text-base leading-relaxed text-white/70">
            Minglab foydalanuvchilar qatoriga qo&apos;shiling va har kuni
            tezroq yozishni boshlang.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-sans text-sm font-bold text-primary shadow-xl shadow-black/20 transition-all duration-200 hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98]"
            >
              Bepul boshlash
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#vitrina"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-8 py-3 font-sans text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
            >
              <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
              Demo ko&apos;rish
            </a>
          </div>

          <p className="mt-5 font-sans text-xs text-white/50">
            Kredit karta talab qilinmaydi · O&apos;rnatish shart emas
          </p>
        </div>
      </Reveal>
    </section>
  )
}
