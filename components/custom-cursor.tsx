'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const ARROW_PATH = 'M3 2 L3 19.5 L7.5 15.3 L10.8 22.5 L13.6 21.2 L10.4 14.1 L16.5 14.1 Z'

export function CustomCursor() {
  const arrowRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)
  const pathname = usePathname()
  const onAdmin  = pathname?.startsWith('/admin') ?? false

  useEffect(() => {
    // Keep the native cursor in the admin panel (a pro tool, not a marketing page)
    if (onAdmin) { setEnabled(false); return }
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
    setEnabled(true)
    document.documentElement.classList.add('tj-custom-cursor')
    return () => document.documentElement.classList.remove('tj-custom-cursor')
  }, [onAdmin])

  useEffect(() => {
    if (!enabled) return

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    function onMove(e: MouseEvent) {
      pos.x = e.clientX
      pos.y = e.clientY
      setVisible(true)
      if (arrowRef.current) {
        arrowRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }
    }
    function onLeave() { setVisible(false) }
    function onDown()  { setPressed(true) }
    function onUp()    { setPressed(false) }

    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', () => setVisible(true))
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [enabled])

  if (!enabled) return null

  const scale = pressed ? 0.88 : 1

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {/* Flat gradient arrow pointer */}
      <div
        ref={arrowRef}
        className="absolute left-0 top-0 transition-opacity duration-150 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <svg
          width="26" height="26" viewBox="0 0 24 24"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: '3px 2px',
            transition: 'transform 150ms ease-out',
            filter: 'drop-shadow(0 3px 8px rgba(37,99,235,0.45))',
          }}
        >
          <defs>
            <linearGradient id="tj-cursor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"  stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
          </defs>
          <path d={ARROW_PATH} fill="url(#tj-cursor-grad)" stroke="white" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
