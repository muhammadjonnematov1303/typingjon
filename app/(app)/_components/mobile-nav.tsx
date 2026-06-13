'use client'

import { usePathname } from 'next/navigation'
import { Home, BookOpen, Zap, Trophy, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { href: '/dashboard',   Icon: Home,     label: 'Asosiy' },
  { href: '/lessons',     Icon: BookOpen, label: 'Darslar' },
  { href: '/test',        Icon: Zap,      label: 'Test' },
  { href: '/leaderboard', Icon: Trophy,   label: 'Reyting' },
  { href: '/settings',    Icon: Settings, label: 'Sozlamalar' },
]

export function MobileNav() {
  const path = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      <div className="grid h-[60px] grid-cols-5">
        {ITEMS.map(({ href, Icon, label }) => {
          const active =
            href === '/dashboard'
              ? path === '/dashboard'
              : path === href || path.startsWith(href + '/')
          return (
            <a
              key={href}
              href={href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 transition-colors',
                active
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300',
              )}
            >
              {/* Active indicator bar at top */}
              {active && (
                <span className="absolute top-0 h-0.5 w-6 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
              <Icon className={cn('h-5 w-5', active && 'stroke-[2.5]')} />
              <span className={cn('text-[9px] font-semibold', active && 'font-bold')}>
                {label}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
