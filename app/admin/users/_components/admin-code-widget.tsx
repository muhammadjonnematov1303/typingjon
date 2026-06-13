'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock } from 'lucide-react'

interface Props {
  code:           string
  initialSeconds: number
}

export function AdminCodeWidget({ code, initialSeconds }: Props) {
  const router = useRouter()
  const [secs, setSecs] = useState(initialSeconds)

  useEffect(() => {
    setSecs(initialSeconds)
  }, [code, initialSeconds])

  useEffect(() => {
    const t = setInterval(() => {
      setSecs(s => (s <= 1 ? 0 : s - 1))
    }, 1000)
    return () => clearInterval(t)
  }, [code])

  useEffect(() => {
    if (secs === 0) router.refresh()
  }, [secs, router])

  const hh = code.slice(0, 2)
  const mm = code.slice(2, 4)
  const ss = ((60 - secs) % 60).toString().padStart(2, '0')

  return (
    <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 dark:border-blue-900/40 dark:bg-blue-950/20">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400">
          Joriy vaqt
        </p>
        <p className="font-mono text-base font-extrabold tracking-[0.15em] text-blue-700 dark:text-blue-300">
          {hh}:{mm}:{ss}
        </p>
      </div>
    </div>
  )
}
