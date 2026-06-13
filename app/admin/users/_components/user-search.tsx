'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export function UserSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(initialQuery)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const sp = new URLSearchParams(searchParams.toString())
      if (value.trim()) sp.set('q', value.trim()); else sp.delete('q')
      sp.delete('page')
      const qs = sp.toString()
      router.push(qs ? `/admin/users?${qs}` : '/admin/users')
    }, 350)
    return () => clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 dark:text-slate-600" />
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        type="text"
        placeholder="Ism yoki email bo'yicha qidirish..."
        className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 font-sans text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-blue-700 dark:focus:ring-blue-900/40"
      />
    </div>
  )
}
