'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Trash2, X } from 'lucide-react'
import { deleteLessonAction } from '@/app/actions/admin-lessons'

export function DeleteLessonButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(deleteLessonAction, null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (!state) return
    if ('error' in state) toast.error(state.error)
    else { toast.success("Dars o'chirildi"); setOpen(false) }
  }, [state])

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10">
        <Trash2 className="h-3.5 w-3.5" />
        O&apos;chirish
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 dark:border-rose-500/30 dark:bg-rose-500/10">
      <span className="text-xs font-medium text-rose-700 dark:text-rose-300">&quot;{title}&quot;ni o&apos;chirasizmi?</span>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" disabled={pending}
          className="rounded-md bg-rose-600 px-2 py-1 text-[11px] font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-50">
          Ha, o&apos;chir
        </button>
      </form>
      <button type="button" onClick={() => setOpen(false)} title="Bekor qilish"
        className="rounded-md p-1 text-rose-400 transition-colors hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
