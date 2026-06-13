'use client'

import { useEffect } from 'react'

// Blocks right-click context menu and copy/cut of page content so lesson
// texts and other content can't be easily copied out of the app.
export function ContentGuard() {
  useEffect(() => {
    function block(e: Event) { e.preventDefault() }

    document.addEventListener('contextmenu', block)
    document.addEventListener('copy', block)
    document.addEventListener('cut', block)

    return () => {
      document.removeEventListener('contextmenu', block)
      document.removeEventListener('copy', block)
      document.removeEventListener('cut', block)
    }
  }, [])

  return null
}
