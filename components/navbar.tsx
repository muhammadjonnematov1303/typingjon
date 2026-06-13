'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Bosh sahifa', href: '#' },
  { label: 'Darslar', href: '#qanday-ishlaydi' },
  { label: 'Reyting', href: '#vitrina' },
  { label: 'Narxlar', href: '#narxlar' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 backdrop-blur-xl transition-all duration-300',
        scrolled
          ? 'border-b border-border/50 bg-background/95 shadow-sm'
          : 'border-b border-transparent bg-background/40',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        <Logo />

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 md:flex">
          <a
            href="/login"
            className="rounded-lg border border-border px-4 py-2 font-sans text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted"
          >
            Kirish
          </a>
          <a
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-sans text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Boshlash
          </a>
        </div>

        {/* Mobile burger */}
        <button
          type="button"
          aria-label="Menyuni ochish"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground transition-all duration-200 hover:bg-muted md:hidden"
        >
          {open
            ? <X className="h-4 w-4" />
            : <Menu className="h-4 w-4" />
          }
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out md:hidden',
          open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl">
          {/* Nav links */}
          <div className="flex flex-col px-4 py-2">
            {links.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={close}
                className={cn(
                  'rounded-xl px-4 py-3 font-sans text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground',
                  open && 'animate-in fade-in slide-in-from-top-1',
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="flex flex-col gap-2 border-t border-border/30 px-4 py-4">
            <a
              href="/login"
              onClick={close}
              className="rounded-xl border border-border px-4 py-3 text-center font-sans text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted"
            >
              Kirish
            </a>
            <a
              href="/register"
              onClick={close}
              className="inline-flex items-center justify-center rounded-xl bg-primary py-3 font-sans text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-200 hover:bg-primary/90"
            >
              Boshlash
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
