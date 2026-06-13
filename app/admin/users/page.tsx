import Link from 'next/link'
import { getDb } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { getCurrentAdminCode, secondsUntilNextMinute } from '@/lib/admin-code'
import {
  Users, UserCheck, ShieldCheck, UserPlus, BadgeCheck, Ban, ChevronLeft, ChevronRight,
  BookOpen, User as UserIcon, Shield, Crown, Eye, type LucideIcon,
} from 'lucide-react'
import { StatCard } from '../_components/stat-card'
import { EmptyState } from '../_components/empty-state'
import { UserSearch } from './_components/user-search'
import { UserFilters } from './_components/user-filters'
import { UserRowActions } from './_components/user-row-actions'
import { AdminCodeWidget } from './_components/admin-code-widget'
import { BulkSelectProvider, SelectAllCheckbox, RowCheckbox } from '../_components/bulk-select'
import { bulkDeleteUsersAction } from '@/app/actions/admin-users'
import {
  CARD, TABLE_CELL_ACTIONS, BTN_SECONDARY,
  PAGE_TITLE, PAGE_SUBTITLE, GRID_USERS_FIXED,
} from '../_lib/ui'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 20

// Premium fixed-width grid (always active — narrow viewports get a horizontal scrollbar instead of stacking)
const HEAD_GRID = 'grid items-center gap-4 border-b border-slate-100 bg-slate-50/80 px-6 py-2.5 dark:border-slate-800 dark:bg-slate-800/60'
const ROW_GRID  = 'grid min-h-[72px] items-center gap-4 px-6 py-3 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30'

interface SearchParams { q?: string; page?: string; role?: string; status?: string; sort?: string }

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function getUsers(params: SearchParams) {
  const db = getDb()
  const q        = params.q?.trim() ?? ''
  const page     = Math.max(1, Number(params.page) || 1)
  const role     = params.role   && params.role   !== 'all' ? params.role   : undefined
  const status   = params.status && params.status !== 'all' ? params.status : undefined
  const sortDir: 'asc' | 'desc' = params.sort === 'asc' ? 'asc' : 'desc'

  const where = {
    ...(q ? { OR: [
      { name:  { contains: q, mode: 'insensitive' as const } },
      { email: { contains: q, mode: 'insensitive' as const } },
    ]} : {}),
    ...(role ? { role } : {}),
    ...(status === 'banned' ? { banned: true } : status === 'active' ? { banned: false } : {}),
  }

  const [total, users, totalLessons] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({
      where,
      orderBy: { createdAt: sortDir },
      skip:    (page - 1) * PAGE_SIZE,
      take:    PAGE_SIZE,
      select:  { id: true, name: true, email: true, image: true, role: true, banned: true, createdAt: true },
    }),
    db.lesson.count(),
  ])

  const progress = users.length
    ? await db.lessonProgress.groupBy({
        by: ['userId'],
        where: { userId: { in: users.map(u => u.id) }, completed: true },
        _count: { _all: true },
      })
    : []
  const progressMap = new Map(progress.map(p => [p.userId, p._count._all]))
  const usersWithProgress = users.map(u => ({ ...u, lessonsDone: progressMap.get(u.id) ?? 0 }))

  return { users: usersWithProgress, total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)), totalLessons }
}

async function getUserStats() {
  const db = getDb()
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 29); cutoff.setHours(0, 0, 0, 0)
  const [total, active, admins, recent] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { banned: false } }),
    db.user.count({ where: { role: 'admin' } }),
    db.user.count({ where: { createdAt: { gte: cutoff } } }),
  ])
  return { total, active, admins, recent }
}

function buildHref(params: SearchParams, overrides: Partial<SearchParams>) {
  const merged = { ...params, ...overrides }
  const sp = new URLSearchParams()
  if (merged.q)                                      sp.set('q',        merged.q)
  if (merged.role     && merged.role     !== 'all')  sp.set('role',     merged.role)
  if (merged.status   && merged.status   !== 'all')  sp.set('status',   merged.status)
  if (merged.sort     && merged.sort     !== 'desc') sp.set('sort',     merged.sort)
  if (merged.page     && merged.page     !== '1')    sp.set('page',     merged.page)
  const qs = sp.toString()
  return qs ? `/admin/users?${qs}` : '/admin/users'
}

const HEADERS: { label: string; align: 'left' | 'center' | 'right'; icon?: LucideIcon }[] = [
  { label: '',              align: 'center' },
  { label: 'Foydalanuvchi', align: 'left'   },
  { label: '',              align: 'center', icon: BookOpen },
  { label: 'Rol',           align: 'center' },
  { label: 'Holat',         align: 'center' },
  { label: "Qo'shilgan",    align: 'left'   },
  { label: 'Amallar',       align: 'right'  },
]

const ROLE_CONFIG: Record<string, { label: string; icon: LucideIcon; cls: string }> = {
  user: {
    label: 'Foydalanuvchi',
    icon:  UserIcon,
    cls:   'text-slate-500 dark:text-slate-400',
  },
  moderator: {
    label: 'Mentor',
    icon:  Shield,
    cls:   'text-blue-600 dark:text-blue-400',
  },
  admin: {
    label: 'Admin',
    icon:  Crown,
    cls:   'text-amber-600 dark:text-amber-400',
  },
}

const STATUS_CONFIG = {
  active: {
    label: 'Faol',
    icon:  UserCheck,
    cls:   'text-emerald-600 dark:text-emerald-400',
  },
  banned: {
    label: 'Bloklangan',
    icon:  Ban,
    cls:   'text-rose-600 dark:text-rose-400',
  },
} as const

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const [currentUserId, { users, total, page, pages, totalLessons }, stats] = await Promise.all([
    getSession(),
    getUsers(params),
    getUserStats(),
  ])
  const adminCode    = getCurrentAdminCode()
  const codeExpires  = secondsUntilNextMinute()

  return (
    <div className="space-y-4 p-6">
      {/* Header + admin code widget */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={PAGE_TITLE}>
            <Users className="h-5 w-5 text-blue-600" />
            Foydalanuvchilar
          </h1>
          <p className={PAGE_SUBTITLE}>Hisoblarni qidiring, filtrlang va rolini boshqaring</p>
        </div>
        <AdminCodeWidget code={adminCode} initialSeconds={codeExpires} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users}       label="Jami foydalanuvchilar"  value={stats.total}  color="text-blue-600"    bg="bg-blue-50 dark:bg-blue-950/40" />
        <StatCard icon={UserCheck}   label="Faol foydalanuvchilar"  value={stats.active} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-950/40" />
        <StatCard icon={ShieldCheck} label="Adminlar"               value={stats.admins} color="text-violet-600"  bg="bg-violet-50 dark:bg-violet-950/40" />
        <StatCard icon={UserPlus}    label="Yangi (so'nggi 30 kun)" value={stats.recent} color="text-orange-500"  bg="bg-orange-50 dark:bg-orange-950/40" />
      </div>

      {/* Toolbar */}
      <div className={cn(CARD, 'flex flex-col gap-3 p-3 sm:flex-row sm:items-center')}>
        <UserSearch initialQuery={params.q ?? ''} />
        <UserFilters
          role={params.role ?? 'all'}
          status={params.status ?? 'all'}
          sort={params.sort ?? 'desc'}
        />
      </div>

      {/* Table */}
      <BulkSelectProvider ids={users.filter(u => u.id !== currentUserId).map(u => u.id)} action={bulkDeleteUsersAction} label="foydalanuvchi">
        <div className={cn(CARD, 'overflow-hidden')}>
          {users.length === 0 ? (
            <EmptyState icon={Users} title="Hech qanday foydalanuvchi topilmadi" subtitle="Qidiruv yoki filtrlarni o'zgartirib qayta urinib ko'ring" />
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Table header */}
                <div className={cn(HEAD_GRID, GRID_USERS_FIXED)}>
                  {HEADERS.map((col, i) => (
                    <span
                      key={i}
                      className={cn(
                        'flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300',
                        col.align === 'center' && 'justify-center',
                        col.align === 'right'  && 'justify-end',
                      )}
                    >
                      {i === 0 ? (
                        <SelectAllCheckbox />
                      ) : (
                        <>
                          {col.icon && <col.icon className="h-3 w-3" />}
                          {col.label}
                        </>
                      )}
                    </span>
                  ))}
                </div>

                {/* Rows */}
                <div className="divide-y divide-slate-50 dark:divide-slate-800/70">
                  {users.map((u, idx) => {
                    const initials  = (u.name[0] ?? '').toUpperCase()
                    const isSelf    = u.id === currentUserId
                    const role      = ROLE_CONFIG[u.role] ?? ROLE_CONFIG.user
                    const RoleIcon  = role.icon
                    const status    = u.banned ? STATUS_CONFIG.banned : STATUS_CONFIG.active
                    const StatusIcon = status.icon
                    const lessonsComplete = totalLessons > 0 && u.lessonsDone >= totalLessons
                    const currentLesson   = totalLessons > 0 ? Math.min(u.lessonsDone + 1, totalLessons) : 0

                    return (
                      <div
                        key={u.id}
                        className={cn(
                          ROW_GRID, GRID_USERS_FIXED, 'group',
                          idx % 2 === 1 && 'bg-slate-50/40 dark:bg-slate-800/20',
                        )}
                      >

                        {/* Checkbox */}
                        <div className="flex items-center justify-center">
                          {isSelf ? <span className="h-[18px] w-[18px]" aria-hidden /> : <RowCheckbox id={u.id} />}
                        </div>

                        {/* User info */}
                        <div className="flex min-w-0 items-center gap-3">
                          <div className={cn(
                            'relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white ring-2 ring-white dark:ring-slate-800',
                            u.banned
                              ? 'bg-gradient-to-br from-slate-400 to-slate-500'
                              : 'bg-gradient-to-br from-blue-500 to-indigo-500 shadow-[0_0_0_3px_rgba(59,130,246,0.12)] dark:shadow-[0_0_0_3px_rgba(96,165,250,0.18)]',
                          )}>
                            {u.image ? <img src={u.image} alt="" className="h-full w-full object-cover" /> : initials}
                            {u.banned && (
                              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/40">
                                <span className="h-5 w-px rotate-45 bg-white/80" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{u.name}</p>
                            <p className="truncate font-mono text-xs text-slate-400 dark:text-slate-500">{u.email}</p>
                          </div>
                        </div>

                        {/* Dars progressi */}
                        <div className="flex flex-col items-center justify-self-center gap-0.5 text-center">
                          <span className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                            <BookOpen className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                            {totalLessons === 0 ? '—' : lessonsComplete ? 'Yakunlandi' : `${currentLesson}-dars`}
                          </span>
                          {totalLessons > 0 && !lessonsComplete && (
                            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                              {u.lessonsDone === 0 ? 'Boshlanmagan' : 'Davom etmoqda'}
                            </span>
                          )}
                        </div>

                        {/* Role */}
                        <span className={cn('flex items-center gap-1.5 justify-self-center text-xs font-bold', role.cls)}>
                          <RoleIcon className="h-3.5 w-3.5 flex-shrink-0" />
                          {role.label}
                        </span>

                        {/* Status */}
                        <span className={cn('flex items-center gap-1.5 justify-self-center text-xs font-bold', status.cls)}>
                          <StatusIcon className="h-3.5 w-3.5 flex-shrink-0" />
                          {status.label}
                        </span>

                        {/* Date */}
                        <span className="text-xs text-slate-500 dark:text-slate-400">{fmtDate(u.createdAt)}</span>

                        {/* Actions */}
                        {isSelf ? (
                          <div className="flex items-center justify-end gap-2">
                            {/* View own profile — manage your own lesson steps */}
                            <Link
                              href={`/admin/users/${u.id}`}
                              aria-label="Profilni ko'rish"
                              title="Profilni ko'rish"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition-all duration-150 hover:scale-105 hover:bg-blue-100 active:scale-95 dark:border-blue-800/50 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/60"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                            <span title="Bu sizning hisobingiz" className={cn(
                              'inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-100 dark:from-blue-950/40 dark:to-indigo-950/30 dark:text-blue-300 dark:ring-blue-900/40')}>
                              <BadgeCheck className="h-3.5 w-3.5" />
                              Siz
                            </span>
                          </div>
                        ) : (
                          <div className="justify-self-end">
                            <UserRowActions
                              userId={u.id}
                              role={u.role}
                              banned={u.banned}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </BulkSelectProvider>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400 dark:text-slate-500">{page} / {pages} sahifa &middot; jami {total} ta</p>
          <div className="flex items-center gap-2">
            <a href={buildHref(params, { page: String(Math.max(1, page - 1)) })}
              aria-disabled={page <= 1}
              className={cn(BTN_SECONDARY, 'px-3', page <= 1 && 'pointer-events-none opacity-40')}>
              <ChevronLeft className="h-3.5 w-3.5" /> Oldingi
            </a>
            <a href={buildHref(params, { page: String(Math.min(pages, page + 1)) })}
              aria-disabled={page >= pages}
              className={cn(BTN_SECONDARY, 'px-3', page >= pages && 'pointer-events-none opacity-40')}>
              Keyingi <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
