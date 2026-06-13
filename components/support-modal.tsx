'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { X, MessageCircle, Send, User, Phone, FileText, CheckCircle2, Loader2 } from 'lucide-react'
import { sendSupportMessage } from '@/app/actions/support'

interface Props {
  open:    boolean
  onClose: () => void
}

const INITIAL = { error: undefined as string | undefined, ok: undefined as true | undefined }

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 9)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`
  if (d.length <= 7) return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`
  return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`
}

export function SupportModal({ open, onClose }: Props) {
  const [state, action, pending] = useActionState(
    async (_: typeof INITIAL, fd: FormData) => {
      const r = await sendSupportMessage(fd)
      return r as typeof INITIAL
    },
    INITIAL,
  )

  const formRef  = useRef<HTMLFormElement>(null)
  const [phoneVal, setPhoneVal] = useState('')

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset()
      setPhoneVal('')
    }
  }, [state.ok])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]" onClick={onClose} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 duration-300">

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-slate-900">Murojaat yuborish</div>
            <div className="text-xs text-slate-400">Xabaringizni qoldirsangiz, tez javob beramiz</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Success state */}
        {state.ok ? (
          <div className="flex flex-col items-center gap-3 px-5 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">Xabar yuborildi!</div>
              <p className="mt-1 text-sm text-slate-400">
                Murojaatingiz qabul qilindi. Tez orada bog&apos;lanamiz.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Yopish
            </button>
          </div>
        ) : (
          <form ref={formRef} action={action} className="space-y-3 p-5">

            {/* Error */}
            {state.error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {state.error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Ism Familiya
                </span>
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="Masalan: Muhammadjon Ne'matov"
                autoComplete="name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Phone — +998 prefix locked, digits auto-formatted */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  Telefon raqam
                </span>
              </label>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 transition-all focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <span className="flex flex-shrink-0 items-center border-r border-slate-200 bg-slate-100 px-3 font-mono text-sm font-bold text-slate-600 select-none">
                  +998
                </span>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={phoneVal}
                  onChange={e => setPhoneVal(formatPhone(e.target.value))}
                  placeholder="71 234 56 78"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  className="min-w-0 flex-1 bg-transparent px-3 py-2.5 font-mono text-sm text-slate-800 outline-none placeholder:font-sans placeholder:text-slate-400"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Beeline, Ucell, Mobiuz, Uzmobile, Humans, Perfectum, OQ
              </p>
            </div>

            {/* Message */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Murojaatingiz
                </span>
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Muammoni yoki savolingizni yozing..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-60"
            >
              {pending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Yuborilmoqda...</>
              ) : (
                <><Send className="h-4 w-4" /> Yuborish</>
              )}
            </button>

          </form>
        )}
      </div>
    </div>
  )
}
