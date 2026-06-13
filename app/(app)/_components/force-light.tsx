'use client'

import { useEffect } from 'react'

// The public/app side is always light. If the admin panel left the `dark` class
// on <html> (e.g. after navigating back from /admin), strip it here so app pages
// never render in dark mode.
export function ForceLight() {
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  })
  return null
}
