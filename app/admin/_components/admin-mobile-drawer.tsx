'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, ShieldCheck, ArrowLeftCircle, LogOut } from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'
import { cn } from '@/lib/utils'
import { ADMIN_NAV } from './admin-sidebar'

export function AdminMobileDrawer() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open])

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname?.startsWith(href + '/')
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Menyuni ochish" aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`} />

        <div className={`absolute inset-y-0 left-0 flex w-[260px] max-w-[82%] flex-col bg-white shadow-2xl transition-transform duration-200 ease-out dark:bg-slate-950 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800">
            <span className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-white" />
              </span>
              <span className="font-sans text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
                Admin <span className="text-slate-400">panel</span>
              </span>
            </span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Yopish"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
            {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
              const active = isActive(href)
              return (
                <a key={href} href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    active
                      ? 'bg-slate-900 font-semibold text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white',
                  )}>
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </a>
              )
            })}
            <div className="my-2 h-px bg-slate-100 dark:bg-slate-800" />
            <a href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70">
              <ArrowLeftCircle className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Ilovaga qaytish</span>
            </a>
          </nav>

          <div className="flex-shrink-0 border-t border-slate-100 p-3 dark:border-slate-800">
            <form action={logoutAction}>
              <button type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40">
                <LogOut className="h-4 w-4 flex-shrink-0" />
                Chiqish
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
