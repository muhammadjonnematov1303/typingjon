'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Keyboard, PanelLeftClose, PanelLeft, LogOut } from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'
import { cn } from '@/lib/utils'
import { NavLinks } from './nav-links'

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  // On tablet-sized screens (md … lg) the sidebar defaults to icon-only so the
  // page gets more room; on desktop (lg+) it stays expanded. The user can still
  // toggle it manually via the logo button.
  useEffect(() => {
    if (window.matchMedia('(max-width: 1023px)').matches) setCollapsed(true)
  }, [])

  // Entering the typing test auto-collapses the sidebar to give the test more room —
  // the user can still expand it manually via the logo button.
  useEffect(() => {
    if (pathname?.startsWith('/test')) setCollapsed(true)
  }, [pathname])

  return (
    <aside className={cn(
      'hidden md:flex flex-shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-900',
      collapsed ? 'w-[76px]' : 'w-[220px]',
    )}>

      {/* Logo — click to collapse / expand the sidebar */}
      <button type="button"
        onClick={() => setCollapsed(v => !v)}
        title={collapsed ? "Sidebar'ni kengaytirish" : "Sidebar'ni yig'ish"}
        aria-pressed={collapsed}
        className={cn(
          'group flex h-14 items-center border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50',
          collapsed ? 'justify-center px-0' : 'gap-3 px-5',
        )}
      >
        <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
          <Keyboard className="h-4 w-4 text-white transition-opacity duration-150 group-hover:opacity-0" />
          {collapsed
            ? <PanelLeft className="absolute h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
            : <PanelLeftClose className="absolute h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
          }
        </div>
        {!collapsed && (
          <span className="font-sans text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
            Typing<span className="text-blue-600">jon</span>
          </span>
        )}
      </button>

      {/* Scrollable nav */}
      <NavLinks collapsed={collapsed} />

      {/* Pinned logout footer */}
      <div className={cn(
        'flex-shrink-0 border-t border-slate-100 p-2.5 dark:border-slate-800',
      )}>
        <form action={logoutAction}>
          <button
            type="submit"
            title={collapsed ? 'Chiqish' : undefined}
            className={cn(
              'group flex w-full items-center rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150',
              'text-slate-400 hover:bg-red-50 hover:text-red-500',
              collapsed ? 'justify-center' : 'gap-3',
            )}
          >
            <LogOut className="h-[17px] w-[17px] flex-shrink-0 group-hover:text-red-500" />
            {!collapsed && (
              <span className="flex-1 text-left">Chiqish</span>
            )}
          </button>
        </form>
      </div>
    </aside>
  )
}
