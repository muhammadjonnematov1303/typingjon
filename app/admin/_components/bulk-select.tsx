'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useActionState } from 'react'
import { toast } from 'sonner'
import { Check, Minus, Trash2, Users, X } from 'lucide-react'

type BulkState = { error?: string; ok?: boolean; count?: number } | null
type BulkAction = (state: any, formData: FormData) => Promise<any>

interface Ctx {
  selected: Set<string>
  toggle: (id: string) => void
  toggleAll: () => void
  allSelected: boolean
  indeterminate: boolean
}
const BulkCtx = createContext<Ctx | null>(null)

function CustomCheckbox({
  checked, indeterminate = false, onChange, onClick, label,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
  onClick?: (e: React.MouseEvent) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label}
      onClick={e => { onClick?.(e); onChange() }}
      className={[
        'group relative flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[5px]',
        'border-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1',
        checked || indeterminate
          ? 'border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500'
          : 'border-slate-300 bg-white hover:border-blue-400 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-500',
      ].join(' ')}
    >
      {indeterminate && !checked ? (
        <Minus className="h-2.5 w-2.5 text-white" strokeWidth={3} />
      ) : checked ? (
        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />
      ) : null}
    </button>
  )
}

interface ProviderProps {
  ids: string[]
  action: BulkAction
  label: string
  children: ReactNode
}

export function BulkSelectProvider({ ids, action, label, children }: ProviderProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [confirming, setConfirming] = useState(false)
  const [state, runAction, pending]: [BulkState, (formData: FormData) => void, boolean] = useActionState(action, null)
  const first = useRef(true)
  const idsKey = ids.join(',')

  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (!state) return
    if (state.error) toast.error(state.error)
    else { toast.success(`${state.count} ta ${label} o'chirildi`); setSelected(new Set()); setConfirming(false) }
  }, [state, label])

  useEffect(() => { setSelected(new Set()); setConfirming(false) }, [idsKey])

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }
  function toggleAll() {
    setSelected(prev => (prev.size === ids.length && ids.length > 0) ? new Set() : new Set(ids))
  }

  const allSelected    = ids.length > 0 && selected.size === ids.length
  const indeterminate  = selected.size > 0 && selected.size < ids.length

  return (
    <BulkCtx.Provider value={{ selected, toggle, toggleAll, allSelected, indeterminate }}>
      {children}

      {/* Floating action bar */}
      {selected.size > 0 && (
        <div className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
          <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white/95 px-5 py-3 shadow-2xl shadow-slate-900/10 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/95">

            {/* Count pill */}
            <div className="flex items-center gap-2 pr-2.5 border-r border-slate-200 dark:border-slate-700">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                <Users className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                {selected.size}
              </span>
              <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:inline">
                ta {label} tanlandi
              </span>
            </div>

            {confirming ? (
              <>
                <span className="hidden text-xs font-medium text-rose-600 dark:text-rose-400 sm:inline">
                  Aniq o&apos;chirilsinmi?
                </span>
                <form action={runAction} className="contents">
                  {[...selected].map(id => <input key={id} type="hidden" name="ids" value={id} />)}
                  <button type="submit" disabled={pending}
                    className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-rose-700 active:scale-95 disabled:opacity-50">
                    <Trash2 className="h-3.5 w-3.5" />
                    {pending ? "O'chirilmoqda…" : "Ha, o'chirish"}
                  </button>
                </form>
                <button type="button" onClick={() => setConfirming(false)} disabled={pending}
                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                  Bekor qilish
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setConfirming(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-rose-700 active:scale-95">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">O&apos;chirish</span>
                </button>
                <button type="button" onClick={() => setSelected(new Set())} title="Tanlovni bekor qilish"
                  className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 active:scale-95 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </BulkCtx.Provider>
  )
}

export function SelectAllCheckbox() {
  const ctx = useContext(BulkCtx)
  if (!ctx) return null
  return (
    <CustomCheckbox
      checked={ctx.allSelected}
      indeterminate={ctx.indeterminate}
      onChange={ctx.toggleAll}
      label="Hammasini tanlash"
    />
  )
}

export function RowCheckbox({ id }: { id: string }) {
  const ctx = useContext(BulkCtx)
  if (!ctx) return null
  return (
    <CustomCheckbox
      checked={ctx.selected.has(id)}
      onChange={() => ctx.toggle(id)}
      onClick={e => e.stopPropagation()}
      label="Tanlash"
    />
  )
}
