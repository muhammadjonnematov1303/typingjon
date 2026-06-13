'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  ShieldCheck, LayoutDashboard, Users, BookOpen, Trophy, BarChart3,
  Settings, ArrowLeftCircle, LogOut, PanelLeft, PanelLeftClose,
} from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

export const ADMIN_NAV = [
  { href: '/admin',             label: 'Boshqaruv paneli', icon: LayoutDashboard },
  { href: '/admin/users',       label: 'Foydalanuvchilar', icon: Users },
  { href: '/admin/lessons',     label: 'Darslar',          icon: BookOpen },
  { href: '/admin/leaderboard', label: 'Reyting',          icon: Trophy },
  { href: '/admin/stats',       label: 'Statistika',       icon: BarChart3 },
  { href: '/admin/settings',    label: 'Sozlamalar',       icon: Settings },
]
const NAV = ADMIN_NAV

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname?.startsWith(href + '/')
  }

  function link(href: string, Icon: React.ComponentType<{ className?: string }>, label: string) {
    const active = isActive(href)
    return (
      <a key={href} href={href} title={collapsed ? label : undefined}
        className={cn(
          'group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
          collapsed ? 'justify-center' : 'gap-3',
          active
            ? 'bg-slate-900 font-semibold text-white shadow-sm shadow-slate-900/10 dark:bg-white dark:text-slate-900'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white',
        )}>
        {active && !collapsed && (
          <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-blue-500" />
        )}
        <Icon className={cn('h-4 w-4 flex-shrink-0 transition-transform', !active && 'group-hover:scale-110')} />
        {!collapsed && <span className="truncate">{label}</span>}
      </a>
    )
  }

  return (
    <aside className={cn(
      'hidden md:flex flex-shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-950',
      collapsed ? 'w-[72px]' : 'w-[204px]',
    )}>

      {/* Brand — click to collapse / expand */}
      <button type="button"
        onClick={() => setCollapsed(v => !v)}
        title={collapsed ? "Sidebar'ni kengaytirish" : "Sidebar'ni yig'ish"}
        aria-pressed={collapsed}
        className={cn(
          'group flex h-14 items-center border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900',
          collapsed ? 'justify-center px-0' : 'gap-3 px-5',
        )}
      >
        <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 shadow-sm">
          <ShieldCheck className="h-4 w-4 text-white transition-opacity duration-150 group-hover:opacity-0" />
          {collapsed
            ? <PanelLeft className="absolute h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
            : <PanelLeftClose className="absolute h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
          }
        </div>
        {!collapsed && (
          <span className="font-sans text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
            Admin <span className="text-slate-400">panel</span>
          </span>
        )}
      </button>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV.map(({ href, label, icon }) => link(href, icon, label))}
        <div className="my-2 h-px bg-slate-100 dark:bg-slate-800" />
        {link('/dashboard', ArrowLeftCircle, 'Ilovaga qaytish')}
      </nav>

      {/* Footer: theme + logout */}
      <div className="space-y-0.5 border-t border-slate-100 p-3 dark:border-slate-800">
        <ThemeToggle collapsed={collapsed} />
        <form action={logoutAction}>
          <button type="submit" title={collapsed ? 'Chiqish' : undefined}
            className={cn(
              'flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40',
              collapsed ? 'justify-center' : 'gap-3',
            )}>
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && 'Chiqish'}
          </button>
        </form>
      </div>
    </aside>
  )
}
