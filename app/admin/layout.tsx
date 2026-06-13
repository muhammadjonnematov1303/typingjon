import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Toaster } from 'sonner'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { isAdminEmail } from '@/lib/admin'
import { ShieldCheck } from 'lucide-react'
import { AdminSidebar } from './_components/admin-sidebar'
import { AdminMobileDrawer } from './_components/admin-mobile-drawer'

export const metadata: Metadata = { title: 'Admin panel' }

async function getAdminUser() {
  const userId = await getSession()
  if (!userId) redirect('/login')
  const db = getDb()
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) redirect('/login')
  if (!isAdminEmail(user.email)) redirect('/dashboard')
  return user
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await getAdminUser()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar — hamburger + brand (sidebar takes over from md up) */}
        <header className="flex h-14 flex-shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <AdminMobileDrawer />
          <span className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-950">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="font-sans text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Admin <span className="text-slate-400">panel</span>
            </span>
          </span>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900">
          {children}
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}
