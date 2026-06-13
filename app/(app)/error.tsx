'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100">
        <AlertTriangle className="h-6 w-6 text-red-500" />
      </div>

      <div>
        <h1 className="font-sans text-lg font-bold text-slate-900">Nimadir xato ketdi</h1>
        <p className="mt-1.5 max-w-sm font-sans text-sm text-slate-500">
          Sahifani yuklashda kutilmagan xatolik yuz berdi. Qayta urinib ko&apos;ring yoki bosh sahifaga qaytib, keyinroq urinib ko&apos;ring.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-[11px] text-slate-400">Xatolik kodi: {error.digest}</p>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2.5">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-sans text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <RefreshCcw className="h-4 w-4" />
          Qayta urinish
        </button>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-sans text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Home className="h-4 w-4" />
          Bosh sahifa
        </a>
      </div>
    </div>
  )
}
