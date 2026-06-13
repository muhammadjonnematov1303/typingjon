import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, User as UserIcon, Shield, Crown, UserCheck, Ban,
  LogIn, LogOut, Clock, type LucideIcon,
} from 'lucide-react'
import { getUserProfileAction } from '@/app/actions/admin-users'
import { getCurrentAdminCode, secondsUntilNextMinute } from '@/lib/admin-code'
import { AdminCodeWidget } from '../_components/admin-code-widget'
import { LessonProgressList } from './_components/lesson-progress-list'
import { CARD, PAGE_TITLE, PAGE_SUBTITLE, BTN_SECONDARY } from '../../_lib/ui'
import { cn } from '@/lib/utils'

const ROLE_CONFIG: Record<string, { label: string; icon: LucideIcon; cls: string }> = {
  user:      { label: 'Foydalanuvchi', icon: UserIcon, cls: 'text-slate-500 dark:text-slate-400' },
  moderator: { label: 'Mentor',        icon: Shield,   cls: 'text-blue-600 dark:text-blue-400' },
  admin:     { label: 'Admin',         icon: Crown,    cls: 'text-amber-600 dark:text-amber-400' },
}

const STATUS_CONFIG = {
  active: { label: 'Faol',       icon: UserCheck, cls: 'text-emerald-600 dark:text-emerald-400' },
  banned: { label: 'Bloklangan', icon: Ban,        cls: 'text-rose-600 dark:text-rose-400' },
} as const

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' })
}

function fmtDateTime(d: Date | string | null): string {
  if (!d) return "Ma'lumot yo'q"
  const date = new Date(d)
  return date.toLocaleString('uz-UZ', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// "2 soat 14 daqiqa" style; falls back to seconds for very short sessions
function fmtDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "Ma'lumot yo'q"
  const totalMin = Math.floor(ms / 60_000)
  const hours    = Math.floor(totalMin / 60)
  const mins     = totalMin % 60
  if (hours > 0) return `${hours} soat ${mins} daqiqa`
  if (mins > 0)  return `${mins} daqiqa`
  return `${Math.max(1, Math.round(ms / 1000))} soniya`
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await getUserProfileAction(id)
  if ('error' in res) notFound()

  const { user, lessons } = res
  const initials = (user.name[0] ?? '').toUpperCase()
  const role      = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.user
  const RoleIcon  = role.icon
  const status     = user.banned ? STATUS_CONFIG.banned : STATUS_CONFIG.active
  const StatusIcon = status.icon

  const adminCode   = getCurrentAdminCode()
  const codeExpires = secondsUntilNextMinute()

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/users" className={cn(BTN_SECONDARY, 'mb-3 px-3')}>
            <ArrowLeft className="h-3.5 w-3.5" /> Foydalanuvchilarga qaytish
          </Link>
          <h1 className={PAGE_TITLE}>
            <UserIcon className="h-5 w-5 text-blue-600" />
            Foydalanuvchi profili
          </h1>
          <p className={PAGE_SUBTITLE}>Dars progressi va hisob ma&apos;lumotlari</p>
        </div>
        <AdminCodeWidget code={adminCode} initialSeconds={codeExpires} />
      </div>

      {/* Profile card */}
      <div className={cn(CARD, 'flex flex-wrap items-center gap-4 p-5')}>
        <div className={cn(
          'relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full text-xl font-bold text-white ring-2 ring-white dark:ring-slate-800',
          user.banned
            ? 'bg-gradient-to-br from-slate-400 to-slate-500'
            : 'bg-gradient-to-br from-blue-500 to-indigo-500 shadow-[0_0_0_3px_rgba(59,130,246,0.12)] dark:shadow-[0_0_0_3px_rgba(96,165,250,0.18)]',
        )}>
          {user.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : initials}
          {user.banned && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/40">
              <span className="h-7 w-px rotate-45 bg-white/80" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-slate-900 dark:text-white">{user.name}</p>
          <p className="truncate font-mono text-xs text-slate-400 dark:text-slate-500">{user.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className={cn('flex items-center gap-1.5 text-xs font-bold', role.cls)}>
            <RoleIcon className="h-3.5 w-3.5 flex-shrink-0" />
            {role.label}
          </span>
          <span className={cn('flex items-center gap-1.5 text-xs font-bold', status.cls)}>
            <StatusIcon className="h-3.5 w-3.5 flex-shrink-0" />
            {status.label}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Qo&apos;shilgan: {fmtDate(user.createdAt)}
          </span>
        </div>
      </div>

      {/* Session activity */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: LogIn,  label: 'Oxirgi kirish',  value: fmtDateTime(user.lastLoginAt), color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
          { icon: LogOut, label: 'Oxirgi faollik', value: fmtDateTime(user.lastSeenAt),  color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-950/40' },
          {
            icon: Clock, label: 'Saytdagi vaqt',
            value: user.lastLoginAt && user.lastSeenAt
              ? fmtDuration(new Date(user.lastSeenAt).getTime() - new Date(user.lastLoginAt).getTime())
              : "Ma'lumot yo'q",
            color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40',
          },
        ].map(s => (
          <div key={s.label} className={cn(CARD, 'flex items-center gap-3 p-4')}>
            <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl', s.bg)}>
              <s.icon className={cn('h-5 w-5', s.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{s.label}</p>
              <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lessons progress */}
      <div className={cn(CARD, 'p-5')}>
        <LessonProgressList userId={user.id} lessons={lessons} />
      </div>
    </div>
  )
}
