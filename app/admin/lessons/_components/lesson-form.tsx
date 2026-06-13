'use client'

import { useActionState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { createLessonAction, updateLessonAction } from '@/app/actions/admin-lessons'
import type { Lesson } from '@/lib/lessons'
import { INPUT, BTN_PRIMARY, BTN_SECONDARY } from '../../_lib/ui'
import { cn } from '@/lib/utils'

const LABEL = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500'

interface Props {
  mode: 'create' | 'edit'
  lesson?: Lesson
}

export function LessonForm({ mode, lesson }: Props) {
  const action = mode === 'create' ? createLessonAction : updateLessonAction
  const [state, formAction, pending] = useActionState(action, null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (state && 'error' in state) toast.error(state.error)
  }, [state])

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL}>ID (slug)</label>
          <input name="id" defaultValue={lesson?.id} required readOnly={mode === 'edit'}
            placeholder="masalan: yangi-dars"
            className={cn(INPUT, 'font-mono', mode === 'edit' && 'cursor-not-allowed opacity-60')} />
        </div>
        <div>
          <label className={LABEL}>Tartib raqami</label>
          <input name="order" type="number" min={1} defaultValue={lesson?.order ?? 1} required className={cn(INPUT, 'font-mono')} />
        </div>
      </div>

      <div>
        <label className={LABEL}>Sarlavha</label>
        <input name="title" defaultValue={lesson?.title} required placeholder="Dars sarlavhasi" className={INPUT} />
      </div>

      <div>
        <label className={LABEL}>Tavsif</label>
        <input name="description" defaultValue={lesson?.description} required placeholder="Qisqacha tavsif" className={INPUT} />
      </div>

      <div>
        <label className={LABEL}>Mashq matni</label>
        <textarea name="text" defaultValue={lesson?.text} required rows={4} placeholder="Foydalanuvchi yozadigan matn"
          className={cn(INPUT, 'h-auto resize-none py-3 font-mono leading-relaxed')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Qiyinlik darajasi</label>
          <select name="difficulty" defaultValue={lesson?.difficulty ?? "Boshlang'ich"} className={INPUT}>
            <option value="Boshlang'ich">Boshlang&apos;ich</option>
            <option value="O'rta">O&apos;rta</option>
            <option value="Murakkab">Murakkab</option>
          </select>
        </div>
        <div>
          <label className={LABEL}>Kategoriya</label>
          <input name="category" defaultValue={lesson?.category ?? 'Umumiy'} placeholder="masalan: Klaviatura asoslari" className={INPUT} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button type="submit" disabled={pending} className={cn(BTN_PRIMARY, 'px-5')}>
          {pending ? 'Saqlanmoqda…' : mode === 'create' ? 'Darsni yaratish' : "O'zgarishlarni saqlash"}
        </button>
        <a href="/admin/lessons" className={cn(BTN_SECONDARY, 'border-transparent px-3 text-slate-400 hover:border-slate-200 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200')}>
          <ArrowLeft className="h-4 w-4" />
          Bekor qilish
        </a>
      </div>
    </form>
  )
}
