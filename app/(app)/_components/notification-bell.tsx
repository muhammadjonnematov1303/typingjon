'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, Sparkles } from 'lucide-react'

interface Notification {
  id:        string
  title:     string
  body:      string
  read:      boolean
  createdAt: string
}

const REFRESH_MS = 10_000

function relativeTime(iso: string) {
  const diff  = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins < 1)  return 'Hozir'
  if (mins < 60) return `${mins} daqiqa oldin`
  if (hours < 24) return `${hours} soat oldin`
  return `${days} kun oldin`
}

export function NotificationBell() {
  const [open, setOpen]                   = useState(false)
  const [items, setItems]                 = useState<Notification[]>([])
  const [loading, setLoading]             = useState(true)
  const ref                               = useRef<HTMLDivElement>(null)
  const unreadCount                       = items.filter(n => !n.read).length

  useEffect(() => {
    let cancelled = false

    function load() {
      fetch('/api/notifications', { cache: 'no-store' })
        .then(r => r.json())
        .then((data: Notification[]) => {
          if (cancelled) return
          setItems(data)
          setLoading(false)
        })
        .catch(() => { if (!cancelled) setLoading(false) })
    }

    load()
    const id = setInterval(load, REFRESH_MS)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  function handleOpen() {
    setOpen(v => !v)
    if (unreadCount > 0) {
      fetch('/api/notifications', { method: 'PATCH' })
        .then(() => setItems(prev => prev.map(n => ({ ...n, read: true }))))
    }
  }

  return (
    <div ref={ref} className="relative">

      <button
        onClick={handleOpen}
        className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-[1.5px] ring-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/[0.07] animate-in fade-in slide-in-from-top-1 duration-150">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <p className="font-sans text-sm font-semibold text-slate-800">Bildirnomalar</p>
            {unreadCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 font-sans text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Bell className="h-7 w-7 text-slate-200" />
              <p className="font-sans text-xs font-medium text-slate-400">Bildirnoma yo&apos;q</p>
            </div>
          ) : (
            <ul className="max-h-72 divide-y divide-slate-50 overflow-y-auto">
              {items.map(n => (
                <li key={n.id}
                  className={`flex gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${!n.read ? 'bg-blue-50/25' : ''}`}>
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-sans text-[13px] font-semibold leading-tight text-slate-800 truncate">
                        {n.title}
                      </p>
                      {!n.read && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />}
                    </div>
                    <p className="mt-0.5 font-sans text-[11px] leading-relaxed text-slate-500">{n.body}</p>
                    <p className="mt-1 font-sans text-[10px] font-medium text-slate-400">{relativeTime(n.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

        </div>
      )}
    </div>
  )
}
