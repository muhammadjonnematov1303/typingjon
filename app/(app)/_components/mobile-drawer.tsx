'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Keyboard, LogOut } from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'
import { NavLinks } from './nav-links'

export function MobileDrawer() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close the drawer whenever the route changes (a nav link was tapped)
  useEffect(() => { setOpen(false) }, [pathname])

  // While open: lock body scroll and close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open])

  return (
    <>
      {/* Hamburger — only on mobile (sidebar takes over from md up) */}
      <button type="button" onClick={() => setOpen(true)} aria-label="Menyuni ochish" aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 active:bg-slate-100 md:hidden">
        <Menu className="h-5 w-5" />
      </button>

      {/* Drawer overlay */}
      <div className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`} />

        <div className={`absolute inset-y-0 left-0 flex w-[270px] max-w-[82%] flex-col bg-white shadow-2xl transition-transform duration-200 ease-out dark:bg-slate-900 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Header — logo always visible */}
          <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800">
            <a href="/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
                <Keyboard className="h-4 w-4 text-white" />
              </div>
              <span className="font-sans text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
                Typing<span className="text-blue-600">jon</span>
              </span>
            </a>
            <button type="button" onClick={() => setOpen(false)} aria-label="Yopish"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <NavLinks />

          <div className="flex-shrink-0 border-t border-slate-100 p-2.5 dark:border-slate-800">
            <form action={logoutAction}>
              <button type="submit"
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-slate-400 transition-all hover:bg-red-50 hover:text-red-500">
                <LogOut className="h-[17px] w-[17px] flex-shrink-0" />
                <span className="flex-1 text-left">Chiqish</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
