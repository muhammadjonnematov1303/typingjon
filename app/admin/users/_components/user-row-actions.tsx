'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Ban, ShieldCheck, Crown, Eye, X, AlertTriangle } from 'lucide-react'
import { setBannedAction, setRoleAction } from '@/app/actions/admin-users'
import { Tooltip } from '../../_components/tooltip'
import { CustomSelect } from '@/components/ui/custom-select'

interface Props {
  userId: string
  role:   string
  banned: boolean
}

const ROLE_LABEL: Record<string, string> = {
  user:      'Foydalanuvchi',
  moderator: 'Mentor',
  admin:     'Admin',
}

const ROLE_OPTIONS = [
  { value: 'user',      label: 'Foydalanuvchi' },
  { value: 'moderator', label: 'Mentor' },
  { value: 'admin',     label: 'Admin' },
]

export function UserRowActions({ userId, role, banned }: Props) {
  const [banState,  banAction,  banPending]  = useActionState(setBannedAction, null)
  const [modalOpen, setModalOpen] = useState(false)
  const [code,  setCode]    = useState('')
  const [rolePick, setRolePick] = useState(role)
  const [error, setError]   = useState('')
  const [isPending, startTransition] = useTransition()
  const banFirst = useRef(true)

  useEffect(() => {
    if (banFirst.current) { banFirst.current = false; return }
    if (!banState) return
    if ('error' in banState) toast.error(banState.error)
    else toast.success((banState as unknown as { banned: boolean }).banned ? 'Foydalanuvchi bloklandi' : 'Blok bekor qilindi')
  }, [banState])

  function openModal() {
    setModalOpen(true)
    setCode(''); setError('')
    setRolePick(role)
  }
  function closeModal() { setModalOpen(false); setCode(''); setError('') }

  function handleCodeInput(v: string) {
    setCode(v.replace(/\D/g, '').slice(0, 4))
  }

  function submitRole() {
    setError('')
    if (rolePick === 'admin' && code.length < 4) { setError("4 xonali kod kiriting"); return }
    startTransition(async () => {
      const fd = new FormData()
      fd.set('userId', userId)
      fd.set('role', rolePick)
      if (rolePick === 'admin') fd.set('code', code)
      const res = await setRoleAction(null, fd)
      if (res && 'error' in res) { setError((res as { error: string }).error); return }
      toast.success('Rol yangilandi')
      closeModal()
    })
  }

  return (
    <>
      {/* ── 3 circular icon buttons ── */}
      <div className="flex items-center justify-end gap-2">

        {/* Profile */}
        <Tooltip label="Profilni ko'rish">
          <Link
            href={`/admin/users/${userId}`}
            aria-label="Profilni ko'rish"
            className="group flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition-all duration-150 hover:scale-105 hover:border-blue-300 hover:bg-blue-100 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 active:scale-95 dark:border-blue-800/50 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/60"
          >
            <Eye className="h-3.5 w-3.5" />
          </Link>
        </Tooltip>

        {/* Ban / unban */}
        <Tooltip label={banned ? 'Blokdan chiqarish' : 'Foydalanuvchini bloklash'}>
          <form action={banAction}>
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="banned" value={(!banned).toString()} />
            <button
              type="submit"
              disabled={banPending}
              aria-label={banned ? 'Blokdan chiqarish' : 'Bloklash'}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-150 hover:scale-105 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50 disabled:hover:scale-100 active:scale-95 ${
                banned
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-400'
                  : 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-400'
              }`}
            >
              {banned ? <ShieldCheck className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
            </button>
          </form>
        </Tooltip>

        {/* Role */}
        <Tooltip label={`Rolni o'zgartirish (${ROLE_LABEL[role] ?? role})`}>
          <button
            type="button"
            onClick={openModal}
            aria-label="Rolni o'zgartirish"
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-150 hover:scale-105 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 active:scale-95 ${
              role === 'admin'
                ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-400'
                : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400'
            }`}
          >
            <Crown className="h-3.5 w-3.5" />
          </button>
        </Tooltip>

      </div>

      {/* ── Role modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-sm animate-in fade-in zoom-in-95 rounded-2xl border border-slate-200 bg-white shadow-2xl duration-150 dark:border-slate-700 dark:bg-slate-900"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30">
                <Crown className="h-5 w-5 text-amber-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  Rolni o'zgartirish
                </p>
                <p className="truncate text-[11px] text-slate-400">
                  Joriy rol: {ROLE_LABEL[role] ?? role}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-3 p-5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  Yangi rol
                </label>
                <CustomSelect
                  name="role"
                  options={ROLE_OPTIONS}
                  value={rolePick}
                  onChange={setRolePick}
                  buttonClassName="h-10 font-semibold"
                />
              </div>

              {rolePick === 'admin' && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">
                    Admin kodi (4 xona)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={code}
                    onChange={e => handleCodeInput(e.target.value)}
                    placeholder="• • • •"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-center font-mono text-xl font-bold tracking-[0.5em] text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              )}

              {error.length > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="button"
                disabled={isPending}
                onClick={submitRole}
                className="flex h-10 w-full items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {isPending ? 'Saqlanmoqda...' : 'Tasdiqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
