import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { Keyboard, ShieldCheck, GraduationCap } from 'lucide-react'
import { isAdminEmail } from '@/lib/admin'
import { NotificationBell } from './_components/notification-bell'
import { UserMenu } from './_components/user-menu'
import { Sidebar } from './_components/sidebar'
import { MobileNav } from './_components/mobile-nav'
import { MobileDrawer } from './_components/mobile-drawer'
import { Heartbeat } from './_components/heartbeat'
import { ForceLight } from './_components/force-light'

export const metadata: Metadata = { title: 'Bosh sahifa' }

async function getUser() {
  const userId = await getSession()
  if (!userId) redirect('/login')
  const db = getDb()
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) redirect('/login')
  return user
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user     = await getUser()
  const initials = (user.name[0] ?? '').toUpperCase()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">

      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main area ── */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Topbar */}
        <header className="flex h-14 flex-shrink-0 animate-in fade-in slide-in-from-top-4 items-center justify-between border-b border-slate-200 bg-white px-4 duration-500 dark:border-slate-800 dark:bg-slate-900 sm:px-6">

          {/* Left: hamburger (mobile) + mobile logo + role badge */}
          <div className="flex min-w-0 items-center gap-1.5">
            <MobileDrawer />
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <Keyboard className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-sans text-sm font-bold tracking-tight text-slate-900">
                Typing<span className="text-blue-600">jon</span>
              </span>
            </div>
            <span className="hidden items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200 md:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              Foydalanuvchi
            </span>
          </div>

          {/* Right: staff link, bell, user */}
          <div className="flex items-center gap-1.5">
            {isAdminEmail(user.email) && (
              <>
                <a href="/admin"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </a>
                <div className="mx-1 hidden h-5 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
              </>
            )}
            {!isAdminEmail(user.email) && user.role === 'moderator' && (
              <>
                <a href="/mentor"
                  className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/60">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Mentor</span>
                </a>
                <div className="mx-1 hidden h-5 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
              </>
            )}
            <NotificationBell />
            <div className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />
            <UserMenu name={user.name} initials={initials} image={user.image ?? null} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 pb-[60px] dark:bg-slate-950 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />

      {/* Keeps "last seen / time on site" fresh */}
      <Heartbeat />

      {/* App side is always light — strip any dark class left by the admin panel */}
      <ForceLight />

    </div>
  )
}
