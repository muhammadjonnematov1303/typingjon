'use client'

import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/use-theme'

export function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { dark, toggle } = useTheme()

  return (
    <button type="button" onClick={toggle} title={dark ? "Yorug' rejim" : "Tungi rejim"}
      className={cn(
        'flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white',
        collapsed ? 'justify-center' : 'gap-3',
      )}>
      {dark ? <Sun className="h-4 w-4 flex-shrink-0" /> : <Moon className="h-4 w-4 flex-shrink-0" />}
      {!collapsed && (dark ? "Yorug' rejim" : 'Tungi rejim')}
    </button>
  )
}
