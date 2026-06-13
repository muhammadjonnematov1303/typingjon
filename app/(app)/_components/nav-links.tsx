'use client'

import { usePathname } from 'next/navigation'
import {
  Home, BookOpen, Zap, Trophy, BarChart2, Award,
  User, Settings, HelpCircle, Mail,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Item {
  href: string
  label: string
  Icon: LucideIcon
}

const SECTIONS: { id: string; label: string; items: Item[] }[] = [
  {
    id: 'main',
    label: 'ASOSIY',
    items: [
      { href: '/dashboard', Icon: Home, label: 'Bosh sahifa' },
    ],
  },
  {
    id: 'learn',
    label: "O'RGANISH",
    items: [
      { href: '/lessons',     Icon: BookOpen,  label: 'Darslar' },
      { href: '/test',        Icon: Zap,       label: 'Yozish testi' },
      { href: '/leaderboard', Icon: Trophy,    label: 'Reyting' },
      { href: '/stats',       Icon: BarChart2, label: 'Statistika' },
      { href: '/achievements', Icon: Award,     label: 'Yutuqlar' },
    ],
  },
  {
    id: 'account',
    label: 'HISOB',
    items: [
      { href: '/profile',  Icon: User,      label: 'Profil' },
      { href: '/settings', Icon: Settings,      label: 'Sozlamalar' },
    ],
  },
  {
    id: 'help',
    label: 'YORDAM',
    items: [
      { href: '/help', Icon: HelpCircle, label: 'Yordam' },
      { href: '/contact', Icon: Mail, label: "Bog'lanish" },
    ],
  },
]

export function NavLinks({ collapsed = false }: { collapsed?: boolean }) {
  const path = usePathname()

  function isActive(href?: string) {
    if (!href) return false
    if (href === '/dashboard') return path === '/dashboard'
    return path === href || path.startsWith(href + '/')
  }

  function renderItem(item: Item) {
    const active = isActive(item.href)
    return (
      <a
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={cn(
          'group flex items-center rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-150',
          collapsed ? 'justify-center' : 'gap-3',
          active
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-sm shadow-blue-200/80 dark:shadow-blue-900/60'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100',
        )}
      >
        <item.Icon className={cn(
          'h-[17px] w-[17px] flex-shrink-0 transition-none',
          active
            ? 'text-white'
            : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-200',
        )} />
        {!collapsed && item.label}
      </a>
    )
  }

  return (
    <nav className="flex-1 overflow-y-auto px-2.5 py-3">
      <div className={cn('space-y-4', collapsed && 'space-y-2')}>
        {SECTIONS.map(({ id, label, items }, idx) => (
          <section key={id}>
            {/* Section label */}
            {!collapsed ? (
              <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400/80 dark:text-slate-600">
                {label}
              </p>
            ) : (
              idx > 0 && (
                <div className="mx-3 mb-2 h-px bg-slate-100 dark:bg-slate-800" />
              )
            )}
            <ul className="space-y-0.5">
              {items.map(item => (
                <li key={item.label}>{renderItem(item)}</li>
              ))}
            </ul>
          </section>
        ))}

      </div>
    </nav>
  )
}
