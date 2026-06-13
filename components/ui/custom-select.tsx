'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  name: string
  options: Option[]
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  buttonClassName?: string
  icon?: LucideIcon
}

export function CustomSelect({ name, options, defaultValue, value: controlledValue, onChange, className, buttonClassName, icon: Icon }: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? '')
  const ref = useRef<HTMLDivElement>(null)

  const value = controlledValue ?? internalValue
  const setValue = (v: string) => {
    if (onChange) onChange(v)
    else setInternalValue(v)
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const selected = options.find(o => o.value === value) ?? options[0]

  return (
    <div ref={ref} className={cn('relative', className)}>
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-300',
          'focus-visible:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-100',
          'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:focus-visible:border-blue-700 dark:focus-visible:ring-blue-900/40',
          open && 'border-blue-300 ring-2 ring-blue-100 dark:border-blue-700 dark:ring-blue-900/40',
          buttonClassName,
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {Icon && <Icon className="h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500" />}
          <span className="truncate">{selected?.label}</span>
        </span>
        <ChevronDown className={cn('h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 z-20 mt-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40"
        >
          {options.map(opt => {
            const active = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { setValue(opt.value); setOpen(false) }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-800',
                )}
              >
                {opt.label}
                {active && <Check className="h-4 w-4 flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
