import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string | number
  color?: string
  bg?: string
  muted?: boolean
  hint?: string
}

export function StatCard({ icon: Icon, label, value, color = 'text-blue-600', bg = 'bg-blue-50', muted = false, hint }: Props) {
  return (
    <div className={cn(
      'group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900',
      muted && 'opacity-60 hover:translate-y-0 hover:shadow-sm',
    )}>
      <div className={cn(
        'absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40',
        bg,
      )} />
      <div className={cn('relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl', bg)}>
        <Icon className={cn('h-5 w-5', color)} />
      </div>
      <div className="relative min-w-0">
        <div className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</div>
        <div className="truncate text-xs font-semibold text-slate-400 dark:text-slate-500">{label}</div>
        {hint && <div className="mt-0.5 truncate text-[11px] text-slate-400 dark:text-slate-500">{hint}</div>}
      </div>
    </div>
  )
}
