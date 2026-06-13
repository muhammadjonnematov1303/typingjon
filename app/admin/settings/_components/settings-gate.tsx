'use client'

import { useState, useTransition } from 'react'
import { Lock, X, KeyRound } from 'lucide-react'
import { verifySettingsCodeAction } from '@/app/actions/admin-settings'

export function SettingsGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [open, setOpen]   = useState(false)
  const [code, setCode]   = useState('')
  const [error, setError] = useState('')
  const [pending, start]  = useTransition()

  function submit() {
    setError('')
    start(async () => {
      const res = await verifySettingsCodeAction(code)
      if (res.ok) { setUnlocked(true); setOpen(false) }
      else setError(res.error ?? "Kod noto'g'ri")
    })
  }

  if (unlocked) return <>{children}</>

  return (
    <>
      {/* Locked card — click to open the code modal */}
      <button
        type="button"
        onClick={() => { setCode(''); setError(''); setOpen(true) }}
        className="flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-blue-950/20"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <Lock className="h-7 w-7 text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Sozlamalar qulflangan</p>
          <p className="mt-1 text-xs text-slate-400">Ochish uchun bosing va 4-xonali kodni kiriting</p>
        </div>
      </button>

      {/* Code modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40">
                  <KeyRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Kodni kiriting</h2>
                  <p className="text-xs text-slate-400">Joriy admin kodi (HH:MM)</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Yopish"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <input
              autoFocus
              value={code}
              onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 4)); setError('') }}
              onKeyDown={e => { if (e.key === 'Enter' && code.length === 4) submit() }}
              inputMode="numeric"
              placeholder="••••"
              className="mt-5 w-full rounded-xl border border-slate-200 bg-white py-3 text-center font-mono text-3xl font-extrabold tracking-[0.5em] text-slate-800 outline-none transition-colors focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            {error && <p className="mt-2 text-center text-xs font-semibold text-rose-500">{error}</p>}

            <button
              type="button"
              onClick={submit}
              disabled={code.length !== 4 || pending}
              className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending ? 'Tekshirilmoqda…' : 'Ochish'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
