'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Mail, Calendar, KeyRound, LogOut, CheckCircle2 } from 'lucide-react'
import { updateProfileAction, changePasswordAction } from '@/app/actions/settings'
import { logoutAction } from '@/app/actions/auth'

interface Props {
  initial: {
    name:      string
    email:     string
    image:     string | null
    createdAt: string
  }
}

const INPUT =
  'w-full rounded-xl border border-slate-200 bg-slate-50/40 px-4 py-2.5 font-sans text-sm text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-blue-700 dark:focus:bg-slate-800 dark:focus:ring-blue-900/40'

// Intl/toLocaleDateString('uz-UZ', { month: 'long' }) renders differently on the server (full ICU)
// vs. the browser (incomplete Uzbek locale data) — causes a hydration mismatch. Format manually instead.
const UZ_MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
]

function fmtDate(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}, ${d.getFullYear()}`
}

function Banner({ kind, text }: { kind: 'error' | 'ok'; text: string }) {
  return kind === 'error' ? (
    <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 animate-in fade-in duration-200 dark:border-red-900/40 dark:bg-red-950/20">
      <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">!</span>
      <p className="text-sm text-red-700 dark:text-red-300">{text}</p>
    </div>
  ) : (
    <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 animate-in fade-in duration-200 dark:border-emerald-900/40 dark:bg-emerald-950/20">
      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
      <p className="text-sm text-emerald-700 dark:text-emerald-300">{text}</p>
    </div>
  )
}

export function SettingsClient({ initial }: Props) {
  const router = useRouter()
  const initials = (initial.name[0] ?? '').toUpperCase()

  // ── Profile form ──
  const [profileState, profileAction, profilePending] = useActionState(updateProfileAction, null)
  const [name, setName] = useState(initial.name)
  useEffect(() => { if (profileState?.ok) router.refresh() }, [profileState, router])

  // ── Password form ──
  const [pwState, pwAction, pwPending] = useActionState(changePasswordAction, null)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext,    setShowNext]    = useState(false)
  const [confirmErr,  setConfirmErr]  = useState('')
  const [current, setCurrent] = useState('')
  const [next,    setNext]    = useState('')
  const [confirm, setConfirm] = useState('')

  function handlePwSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (next !== confirm) {
      e.preventDefault()
      setConfirmErr("Yangi parollar mos kelmadi")
      return
    }
    setConfirmErr('')
  }

  useEffect(() => {
    if (pwState?.ok) {
      setCurrent('')
      setNext('')
      setConfirm('')
      setConfirmErr('')
    }
  }, [pwState])

  return (
    <div className="space-y-5 p-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Sozlamalar</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500">Hisobingiz va xavfsizlik sozlamalarini boshqaring</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">

        {/* ── Profile card ── */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Profil ma&apos;lumotlari</h2>
          </div>

          <div className="flex items-center gap-4">
            {initial.image ? (
              <img src={initial.image} alt={initial.name} referrerPolicy="no-referrer"
                className="h-16 w-16 flex-shrink-0 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
            ) : (
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{initial.name}</p>
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-400 dark:text-slate-500">
                <Mail className="h-3 w-3 flex-shrink-0" />
                {initial.email}
              </p>
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-400 dark:text-slate-500">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                {fmtDate(initial.createdAt)} dan beri a&apos;zo
              </p>
            </div>
          </div>

          {profileState?.error && <Banner kind="error" text={profileState.error} />}
          {profileState?.ok    && <Banner kind="ok"    text="Ism muvaffaqiyatli yangilandi" />}

          <form action={profileAction} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Ism</label>
              <input name="name" value={name} onChange={e => setName(e.target.value)} required minLength={2} className={INPUT} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Email</label>
              <input value={initial.email} disabled
                className={INPUT + ' cursor-not-allowed text-slate-400 dark:text-slate-500'} />
              <p className="text-[11px] text-slate-300 dark:text-slate-600">Email manzilni o&apos;zgartirib bo&apos;lmaydi</p>
            </div>
            <button type="submit" disabled={profilePending}
              className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              {profilePending ? 'Saqlanmoqda…' : 'Saqlash'}
            </button>
          </form>
        </div>

        {/* ── Password card ── */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
              <KeyRound className="h-4 w-4 text-violet-600" />
            </div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Parolni o&apos;zgartirish</h2>
          </div>

          {pwState?.error && <Banner kind="error" text={pwState.error} />}
          {confirmErr     && <Banner kind="error" text={confirmErr} />}
          {pwState?.ok    && <Banner kind="ok"    text="Parol muvaffaqiyatli yangilandi" />}

          <form action={pwAction} onSubmit={handlePwSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Joriy parol</label>
              <div className="relative">
                <input name="current" type={showCurrent ? 'text' : 'password'} required placeholder="••••••••"
                  value={current} onChange={e => setCurrent(e.target.value)}
                  className={INPUT + ' pr-11'} />
                <button type="button" onClick={() => setShowCurrent(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Yangi parol</label>
              <div className="relative">
                <input name="next" type={showNext ? 'text' : 'password'} required minLength={8} placeholder="kamida 8 ta belgi"
                  value={next} onChange={e => setNext(e.target.value)}
                  className={INPUT + ' pr-11'} />
                <button type="button" onClick={() => setShowNext(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400">
                  {showNext ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Yangi parolni tasdiqlang</label>
              <input name="confirm" type={showNext ? 'text' : 'password'} required minLength={8} placeholder="••••••••"
                value={confirm} onChange={e => setConfirm(e.target.value)}
                className={INPUT} />
            </div>
            <button type="submit" disabled={pwPending}
              className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60">
              {pwPending ? 'Yangilanmoqda…' : 'Parolni yangilash'}
            </button>
          </form>
        </div>
      </div>

      {/* ── Danger zone ── */}
      <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50/40 p-5 dark:border-red-900/40 dark:bg-red-950/15">
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Hisobdan chiqish</h2>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Joriy qurilmadan tizimdan chiqasiz</p>
        </div>
        <form action={logoutAction}>
          <button type="submit"
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:bg-slate-900 dark:hover:bg-red-950/30">
            <LogOut className="h-4 w-4" />
            Chiqish
          </button>
        </form>
      </div>
    </div>
  )
}
