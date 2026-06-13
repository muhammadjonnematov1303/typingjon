'use client'

import { useState, useTransition } from 'react'
import { Trash2, ShieldAlert, X } from 'lucide-react'
import { toast } from 'sonner'
import { clearAllUsersAction } from '@/app/actions/admin-settings'
import { CARD } from '../../_lib/ui'
import { cn } from '@/lib/utils'

export function DangerZone() {
  const [open, setOpen]   = useState(false)
  const [code, setCode]   = useState('')
  const [error, setError] = useState('')
  const [pending, start]  = useTransition()

  function confirm() {
    setError('')
    start(async () => {
      const res = await clearAllUsersAction(code)
      if (res.ok) {
        toast.success(res.deleted > 0 ? `${res.deleted} ta foydalanuvchi tozalandi` : "Tozalanadigan foydalanuvchi yo'q")
        setOpen(false); setCode('')
      } else {
        setError(res.error ?? 'Xatolik yuz berdi')
      }
    })
  }

  return (
    <div className={cn(CARD, 'border-rose-200 p-5 dark:border-rose-900/50')}>
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/40">
          <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Xavfli hudud</h2>
          <p className="text-xs text-slate-400">Bu amallar qaytarib bo&apos;lmaydi</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-rose-100 bg-rose-50/50 p-4 dark:border-rose-900/40 dark:bg-rose-950/20 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Foydalanuvchilarni tozalash</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Adminlardan tashqari barcha foydalanuvchilar va ularning ma&apos;lumotlari o&apos;chiriladi</p>
        </div>
        <button
          type="button"
          onClick={() => { setCode(''); setError(''); setOpen(true) }}
          className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
        >
          <Trash2 className="h-4 w-4" />
          Tozalash
        </button>
      </div>

      {/* Confirmation modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40">
                  <Trash2 className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Tasdiqlash</h2>
                  <p className="text-xs text-slate-400">Bu amalni qaytarib bo&apos;lmaydi</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Yopish"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              Davom etish uchun 4-xonali admin kodini kiriting.
            </p>

            <input
              autoFocus
              value={code}
              onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 4)); setError('') }}
              onKeyDown={e => { if (e.key === 'Enter' && code.length === 4) confirm() }}
              inputMode="numeric"
              placeholder="••••"
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-3 text-center font-mono text-2xl font-extrabold tracking-[0.4em] text-slate-800 outline-none transition-colors focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            {error && <p className="mt-2 text-center text-xs font-semibold text-rose-500">{error}</p>}

            <div className="mt-5 flex gap-2.5">
              <button type="button" onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Bekor qilish
              </button>
              <button type="button" onClick={confirm} disabled={code.length !== 4 || pending}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40">
                {pending ? "O'chirilmoqda…" : "Ha, tozalash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
