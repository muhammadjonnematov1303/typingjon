'use client'

import { useActionState, useState, useEffect } from 'react'
import { Eye, EyeOff, ArrowRight, Keyboard, Zap, Target, BarChart2, Trophy, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { loginAction } from '@/app/actions/auth'
import type { LucideIcon } from 'lucide-react'

const features: { icon: LucideIcon; text: string }[] = [
  { icon: Zap,       text: 'Real vaqt tahlili'  },
  { icon: Target,    text: 'Aniqlikni oshirish'  },
  { icon: BarChart2, text: 'Shaxsiy statistika'  },
  { icon: Trophy,    text: 'Yutuqlar tizimi'     },
]

function fadeUp(delay: number) {
  return {
    className: 'animate-in fade-in slide-in-from-bottom-4 duration-500',
    style: { animationDelay: `${delay}ms`, animationFillMode: 'both' as const },
  }
}

function fadeLeft(delay: number) {
  return {
    className: 'animate-in fade-in slide-in-from-left-6 duration-700',
    style: { animationDelay: `${delay}ms`, animationFillMode: 'both' as const },
  }
}

const INPUT =
  'w-full rounded-xl border border-border bg-muted/30 px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/15'

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null)
  const [show, setShow]          = useState(false)
  const [oauthError, setOauthError] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const e = p.get('error')
    if (e === 'google_failed')    setOauthError("Google bilan kirish muvaffaqiyatsiz bo'ldi. Qayta urinib ko'ring.")
    if (e === 'google_cancelled') setOauthError('Google kirish bekor qilindi.')
    if (e === 'config')           setOauthError('Google kirish hozircha sozlanmagan.')
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Left panel ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-12 lg:flex lg:w-[45%]">

        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          style={{ animation: 'tj-float 8s ease-in-out infinite' }} />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"
          style={{ animation: 'tj-float 10s ease-in-out infinite reverse' }} />

        {/* Logo */}
        <div {...fadeLeft(0)} className={`relative z-10 ${fadeLeft(0).className}`} style={fadeLeft(0).style}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
              <Keyboard className="h-5 w-5 text-white" />
            </div>
            <span className="font-mono text-xl font-bold text-white">Typingjon</span>
          </div>
        </div>

        {/* Center text */}
        <div className="relative z-10">
          <div className="mb-5 inline-flex animate-in fade-in slide-in-from-left-6 duration-700 items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-white/20"
            style={{ animationDelay: '120ms', animationFillMode: 'both' }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            <span className="font-sans text-xs font-medium text-white/90">50,000+ foydalanuvchi</span>
          </div>

          <h2 {...fadeLeft(200)} className={`font-sans text-4xl font-bold leading-tight text-white ${fadeLeft(200).className}`} style={fadeLeft(200).style}>
            Tezroq yozing.<br />
            <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Aqlliroq o&apos;rganing.
            </span>
          </h2>

          <p {...fadeLeft(320)} className={`mt-4 font-sans text-sm leading-relaxed text-blue-100/70 ${fadeLeft(320).className}`} style={fadeLeft(320).style}>
            Minglab foydalanuvchilar bilan birgalikda klaviatura mahoratingizni oshiring.
          </p>

          <ul className="mt-7 space-y-2.5">
            {features.map((f, i) => (
              <li key={f.text}
                className="flex animate-in fade-in slide-in-from-left-6 duration-500 items-center gap-3"
                style={{ animationDelay: `${460 + i * 90}ms`, animationFillMode: 'both' }}>
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/12 ring-1 ring-white/10">
                  <f.icon className="h-4 w-4 text-white" />
                </span>
                <span className="font-sans text-sm font-medium text-white/85">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stats */}
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: '900ms', animationFillMode: 'both' }}>
          <div className="mb-5 h-px bg-white/15" />
          <div className="flex items-center gap-6">
            <div className="group cursor-default">
              <div className="font-mono text-2xl font-bold text-white">50K+</div>
              <div className="mt-0.5 font-sans text-xs text-blue-200/60">Foydalanuvchi</div>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="group cursor-default">
              <div className="font-mono text-2xl font-bold text-white">98%</div>
              <div className="mt-0.5 font-sans text-xs text-blue-200/60">Mamnunlik</div>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="group cursor-default">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="mt-1.5 font-sans text-xs text-blue-200/60">5.0 Reyting</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">

        {/* Mobile logo */}
        <div {...fadeUp(0)} className={`mb-8 lg:hidden ${fadeUp(0).className}`} style={fadeUp(0).style}>
          <Logo />
        </div>

        <div className="w-full max-w-[400px]">

          {/* Header */}
          <div {...fadeUp(100)} className={`mb-8 ${fadeUp(100).className}`} style={fadeUp(100).style}>
            <h1 className="font-sans text-2xl font-bold text-foreground">Xush kelibsiz!</h1>
            <p className="mt-1.5 font-sans text-sm text-muted-foreground">
              Hisobingizga kiring va mashqlarni davom ettiring.
            </p>
          </div>

          {/* Error (server action or OAuth) */}
          {(state?.error || oauthError) && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 animate-in fade-in duration-200">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">!</span>
              <p className="font-sans text-sm text-red-700">{state?.error ?? oauthError}</p>
            </div>
          )}

          {/* Form */}
          <form action={action} className="space-y-4">

            <div {...fadeUp(200)} className={`space-y-1.5 ${fadeUp(200).className}`} style={fadeUp(200).style}>
              <label className="font-sans text-sm font-medium text-foreground">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="email@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className={INPUT}
              />
            </div>

            <div {...fadeUp(300)} className={`space-y-1.5 ${fadeUp(300).className}`} style={fadeUp(300).style}>
              <label className="font-sans text-sm font-medium text-foreground">Parol</label>
              <div className="relative">
                <input
                  name="password"
                  type={show ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className={INPUT + ' pr-11'}
                />
                <button type="button" onClick={() => setShow(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <a href="#" className="block text-right font-sans text-xs text-primary transition-colors hover:text-primary/80">
                Parolni unutdingizmi?
              </a>
            </div>

            <div {...fadeUp(400)} className={fadeUp(400).className} style={fadeUp(400).style}>
              <Button
                type="submit"
                disabled={pending}
                className="group relative mt-2 h-auto w-full overflow-hidden rounded-xl bg-primary py-3 font-sans text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:scale-[1.01] hover:shadow-primary/40 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
              >
                {!pending && (
                  <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                )}
                {pending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Kirilmoqda...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Kirish
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div {...fadeUp(480)} className={`my-6 flex items-center gap-3 ${fadeUp(480).className}`} style={fadeUp(480).style}>
            <div className="h-px flex-1 bg-border" />
            <span className="font-sans text-xs text-muted-foreground">yoki</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google */}
          <div {...fadeUp(550)} className={fadeUp(550).className} style={fadeUp(550).style}>
            <a href="/api/auth/google"
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 font-sans text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted hover:border-border/80 hover:scale-[1.01]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google bilan kirish
            </a>
          </div>

          {/* Sign up link */}
          <p {...fadeUp(620)} className={`mt-6 text-center font-sans text-sm text-muted-foreground ${fadeUp(620).className}`} style={fadeUp(620).style}>
            Hisobingiz yo&apos;qmi?{' '}
            <a href="/register" className="font-semibold text-primary transition-colors hover:text-primary/80">
              Ro&apos;yxatdan o&apos;ting
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
