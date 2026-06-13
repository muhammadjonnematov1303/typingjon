'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="uz">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center font-sans">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Sayt vaqtincha ishlamayapti</h1>
          <p className="mt-1.5 max-w-sm text-sm text-slate-500">
            Kutilmagan xatolik yuz berdi. Iltimos, sahifani yangilang yoki birozdan so&apos;ng qayta urinib ko&apos;ring.
          </p>
          {error.digest && (
            <p className="mt-2 font-mono text-[11px] text-slate-400">Xatolik kodi: {error.digest}</p>
          )}
        </div>
        <button
          onClick={reset}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Qayta urinish
        </button>
      </body>
    </html>
  )
}
