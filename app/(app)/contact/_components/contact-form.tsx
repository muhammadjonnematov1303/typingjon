'use client'

import { useActionState, useEffect, useState } from 'react'
import { sendContactAction } from '@/app/actions/contact'
import { Send, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CustomSelect } from '@/components/ui/custom-select'

const INPUT = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-blue-700 dark:focus:ring-blue-900/40'

const TYPES = [
  { value: 'muammo', label: 'Muammo bildirish' },
  { value: 'taklif', label: 'Taklif yuborish' },
  { value: 'savol',  label: 'Savol berish' },
  { value: 'boshqa', label: 'Boshqa' },
]

export function ContactForm({ defaultName = '' }: { defaultName?: string }) {
  const [state, action, pending] = useActionState(sendContactAction, null)

  const [name, setName]       = useState(defaultName)
  const [type, setType]       = useState('muammo')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (state?.ok) {
      setName(defaultName)
      setType('muammo')
      setMessage('')
    }
  }, [state, defaultName])

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center dark:border-emerald-800/40 dark:bg-emerald-950/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
            Murojaatingiz qabul qilindi!
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            Tez orada javob beramiz. Bildirishnomalarni kuzatib boring.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-400">
          {state.error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
            Ismingiz
          </label>
          <input
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ism Familiya"
            required
            className={INPUT}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
            Murojaat turi
          </label>
          <CustomSelect name="type" options={TYPES} value={type} onChange={setType} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
          Xabar
        </label>
        <textarea
          name="message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={4}
          placeholder="Muammo, taklif yoki savolingizni yozing..."
          required
          className={cn(INPUT, 'h-auto resize-none py-3 leading-relaxed')}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm shadow-blue-200/60 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-none"
      >
        {pending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Yuborilmoqda...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Yuborish
          </>
        )}
      </button>
    </form>
  )
}
