'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Tooltip({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <span className={cn('group/tooltip relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-9 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-all duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 dark:bg-slate-700"
      >
        {label}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700" />
      </span>
    </span>
  )
}
