'use client'

import { useEffect } from 'react'

const INTERVAL_MS = 60_000

// Keeps the user's `lastSeenAt` fresh: pings every minute while the tab is
// visible, and fires a final beacon when the tab is hidden/closed so the admin
// view can show roughly when the user left and how long they stayed.
export function Heartbeat() {
  useEffect(() => {
    const ping = () => {
      fetch('/api/heartbeat', { method: 'POST', keepalive: true }).catch(() => {})
    }

    ping()
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') ping()
    }, INTERVAL_MS)

    const onHidden = () => {
      if (document.visibilityState === 'hidden') {
        // sendBeacon survives the page unloading; fall back to keepalive fetch
        if (!navigator.sendBeacon?.('/api/heartbeat')) ping()
      }
    }
    document.addEventListener('visibilitychange', onHidden)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onHidden)
    }
  }, [])

  return null
}
