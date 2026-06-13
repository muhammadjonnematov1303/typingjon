import type { ComponentType } from 'react'

interface Props {
  icon: ComponentType<{ className?: string }>
  title: string
  subtitle?: string
}

export function EmptyState({ icon: Icon, title, subtitle }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
        <Icon className="h-7 w-7 text-slate-300 dark:text-slate-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</p>
        {subtitle && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>}
      </div>
    </div>
  )
}
