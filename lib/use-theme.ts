'use client'

import { useEffect, useState } from 'react'

const KEY = 'tj-theme'

// Theme state for the ADMIN panel only (the public/app side is always light).
// Applies the saved preference to <html> on mount and keeps it in sync on toggle.
export function useTheme() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    let saved: string | null = null
    try { saved = localStorage.getItem(KEY) } catch {}
    const isDark = saved === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
    setDark(isDark)
  }, [])

  function toggle() {
    setDark(prev => {
      const next = !prev
      try { localStorage.setItem(KEY, next ? 'dark' : 'light') } catch {}
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }

  return { dark, toggle }
}
