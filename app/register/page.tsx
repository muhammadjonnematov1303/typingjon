'use client'

import { useActionState } from 'react'
import { Check, Keyboard, Star, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { useState } from 'react'
import { registerAction } from '@/app/actions/auth'

const perks = [
  'Bepul darslar va real vaqt mashqlari',
  'Shaxsiy statistika va taraqqiyot grafigi',
  'Global reyting va hamjamiyat',
  'Gamifikatsiya: XP, badge va darajalar',
]

const stats = [
  { value: '50K+', label: 'Foydalanuvchi' },
  { value: '2x',   label: 'Tezlik oshishi' },
  { value: '30',   label: 'Kun ichida' },
]

function fadeLeft(delay: number) {
  return {
    className: 'animate-in fade-in slide-in-from-left-6 duration-700',
    style: { animationDelay: `${delay}ms`, animationFillMode: 'both' as const },
  }
}

function fadeUp(delay: number) {
  return {
    className: 'animate-in fade-in slide-in-from-bottom-4 duration-500',
    style: { animationDelay: `${delay}ms`, animationFillMode: 'both' as const },
  }
}

const inputBase =
  'w-full rounded-xl border bg-muted/40 px-3.5 py-2.5 font-sans text-sm text-foreground ' +
  'placeholder:text-muted-foreground/50 outline-none transition-all duration-200 ' +
  'focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/15'

const inputErr =
  'w-full rounded-xl border-2 border-red-400 bg-red-50/30 px-3.5 py-2.5 font-sans text-sm text-foreground ' +
  'placeholder:text-muted-foreground/50 outline-none transition-all duration-200 ' +
  'focus:border-red-400 focus:ring-2 focus:ring-red-400/20'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, null)
  const [showPass, setShowPass]  = useState(false)
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed]     = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Left panel ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-10 lg:flex lg:w-[44%]">

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-white/10 blur-3xl"
          style={{ animation: 'tj-float 8s ease-in-out infinite' }} />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"
          style={{ animation: 'tj-float 11s ease-in-out infinite reverse' }} />

        {/* Logo */}
        <div {...fadeLeft(0)} className={`relative z-10 flex items-center gap-3 ${fadeLeft(0).className}`} style={fadeLeft(0).style}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 hover:scale-110">
            <Keyboard className="h-5 w-5 text-white" />
          </div>
          <span className="font-mono text-xl font-bold tracking-tight text-white">Typingjon</span>
        </div>

        {/* Center */}
        <div className="relative z-10 space-y-7">
          <div>
            <div {...fadeLeft(100)} className={`mb-4 inline-flex items-center gap-2 rounded-full bg-green-400/20 px-3.5 py-1.5 ring-1 ring-green-400/30 ${fadeLeft(100).className}`} style={fadeLeft(100).style}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
              <span className="font-sans text-xs font-semibold text-green-300">Bepul boshlash · Kredit karta shart emas</span>
            </div>
            <h2 {...fadeLeft(200)} className={`font-sans text-4xl font-bold leading-tight tracking-tight text-white ${fadeLeft(200).className}`} style={fadeLeft(200).style}>
              Tezroq yozing.<br />
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">Ko&apos;proq erishing.</span>
            </h2>
            <p {...fadeLeft(320)} className={`mt-3 font-sans text-sm leading-relaxed text-blue-100/70 ${fadeLeft(320).className}`} style={fadeLeft(320).style}>
              O&apos;zbek tilida yozish tezligini oshirish uchun yaratilgan eng ilg&apos;or platforma.
            </p>
          </div>

          {/* Stats */}
          <div {...fadeLeft(420)} className={`grid grid-cols-3 gap-2.5 ${fadeLeft(420).className}`} style={fadeLeft(420).style}>
            {stats.map(({ value, label }) => (
              <div key={label} className="rounded-xl bg-white/10 p-3.5 text-center ring-1 ring-white/15 transition-all duration-200 hover:bg-white/15">
                <div className="font-mono text-2xl font-bold text-white">{value}</div>
                <div className="mt-0.5 font-sans text-[11px] text-blue-200/75">{label}</div>
              </div>
            ))}
          </div>

          {/* Perks */}
          <ul className="space-y-3">
            {perks.map((text, i) => (
              <li key={text} className="flex animate-in fade-in items-center gap-3 slide-in-from-left-6 duration-500"
                style={{ animationDelay: `${540 + i * 100}ms`, animationFillMode: 'both' }}>
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-400/20 ring-1 ring-green-400/30">
                  <Check className="h-3 w-3 text-green-400" strokeWidth={3} />
                </span>
                <span className="font-sans text-sm text-white/85">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom testimonial */}
        <div {...fadeLeft(960)} className={`relative z-10 ${fadeLeft(960).className}`} style={fadeLeft(960).style}>
          <div className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/12 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-400/20 px-2 py-0.5 ring-1 ring-green-400/30">
                <Check className="h-2.5 w-2.5 text-green-400" strokeWidth={3} />
                <span className="font-sans text-[10px] font-semibold text-green-300">Tasdiqlangan foydalanuvchi</span>
              </span>
            </div>
            <p className="font-sans text-[13px] leading-relaxed text-white/90">
              &ldquo;WPM ko&apos;rsatkichim 38 dan 74 ga chiqdi. Buni faqat Typingjon bilan 3 haftada erishdim.&rdquo;
            </p>
            <div className="mt-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 font-sans text-xs font-bold text-white ring-2 ring-white/20">N</div>
                <div>
                  <p className="font-sans text-xs font-semibold leading-none text-white">Nilufar Rahimova</p>
                  <p className="mt-0.5 font-sans text-[11px] text-blue-200/60">Dasturchi · Toshkent</p>
                </div>
              </div>
              <div className="flex items-center">
                {['J','B','A','D'].map((l, i) => (
                  <div key={l} className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-700 font-sans text-[10px] font-bold text-white ring-2 ring-blue-800"
                    style={{ marginLeft: i === 0 ? 0 : '-6px' }}>{l}</div>
                ))}
                <span className="ml-1.5 font-sans text-[11px] text-blue-200/70">+49K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-hidden px-6 lg:px-14">
        <div {...fadeUp(0)} className={`mb-6 lg:hidden ${fadeUp(0).className}`} style={fadeUp(0).style}>
          <Logo />
        </div>

        <div className="w-full max-w-[400px]">

          {/* Header */}
          <div {...fadeUp(80)} className={`mb-6 ${fadeUp(80).className}`} style={fadeUp(80).style}>
            <h1 className="font-sans text-2xl font-bold text-foreground">Hisob yarating</h1>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              Bepul ro&apos;yxatdan o&apos;ting. Kredit karta talab qilinmaydi.
            </p>
          </div>

          {/* Google */}
          <div {...fadeUp(140)} className={fadeUp(140).className} style={fadeUp(140).style}>
            <a href="/api/auth/google"
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 font-sans text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted hover:scale-[1.01]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google bilan davom etish
            </a>
          </div>

          <div {...fadeUp(190)} className={`my-4 flex items-center gap-3 ${fadeUp(190).className}`} style={fadeUp(190).style}>
            <div className="h-px flex-1 bg-border" />
            <span className="font-sans text-xs text-muted-foreground">yoki email bilan</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Server error */}
          {state?.error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 animate-in fade-in duration-200">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">!</span>
              <p className="font-sans text-sm text-red-700">{state.error}</p>
            </div>
          )}

          {/* Form */}
          <form action={action} className="space-y-3">

            {/* To'liq ism */}
            <div {...fadeUp(240)} className={fadeUp(240).className} style={fadeUp(240).style}>
              <label htmlFor="name" className="font-sans text-xs font-medium text-foreground">To&apos;liq ism</label>
              <input
                id="name" name="name" type="text" required
                placeholder="Ism Familiya"
                value={name} onChange={e => setName(e.target.value)}
                className={inputBase + ' mt-1'}
              />
            </div>

            {/* Email */}
            <div {...fadeUp(300)} className={fadeUp(300).className} style={fadeUp(300).style}>
              <label htmlFor="email" className="font-sans text-xs font-medium text-foreground">Email</label>
              <input
                id="email" name="email" type="email" required
                placeholder="email@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className={inputBase + ' mt-1'}
              />
            </div>

            {/* Parol */}
            <div {...fadeUp(360)} className={fadeUp(360).className} style={fadeUp(360).style}>
              <label htmlFor="password" className="font-sans text-xs font-medium text-foreground">Parol</label>
              <div className="relative mt-1">
                <input
                  id="password" name="password"
                  type={showPass ? 'text' : 'password'}
                  required placeholder="Kamida 8 ta belgi"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className={inputBase + ' pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-foreground"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 font-sans text-[11px] text-muted-foreground">Kamida 8 ta belgi ishlatilsin</p>
            </div>

            {/* Terms */}
            <div {...fadeUp(410)} className={fadeUp(410).className} style={fadeUp(410).style}>
              <label className="group flex cursor-pointer items-start gap-3">
                <input name="agreed" type="checkbox" required
                  checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border accent-primary" />
                <span className="font-sans text-[11.5px] text-muted-foreground transition-colors group-hover:text-foreground/80">
                  <a href="/terms" target="_blank" className="font-semibold text-primary hover:text-primary/80">Foydalanish shartlari</a>
                  {' '}va{' '}
                  <a href="/privacy" target="_blank" className="font-semibold text-primary hover:text-primary/80">Maxfiylik siyosati</a>
                  {' '}ni o&apos;qib, roziman
                </span>
              </label>
            </div>

            {/* Submit */}
            <div {...fadeUp(460)} className={fadeUp(460).className} style={fadeUp(460).style}>
              <Button
                type="submit"
                disabled={pending}
                className="group relative h-auto w-full overflow-hidden rounded-xl bg-primary py-3 font-sans text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:scale-[1.01] hover:shadow-primary/40 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {!pending && (
                  <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                )}
                {pending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Tekshirilmoqda...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Ro&apos;yxatdan o&apos;tish
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <p {...fadeUp(520)} className={`mt-5 text-center font-sans text-sm text-muted-foreground ${fadeUp(520).className}`} style={fadeUp(520).style}>
            Allaqachon hisobingiz bormi?{' '}
            <a href="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">Kirish</a>
          </p>
        </div>
      </div>
    </div>
  )
}
