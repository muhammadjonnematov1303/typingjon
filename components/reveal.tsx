'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const useSafeLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Start VISIBLE — prevents flash on SSR hydration AND back navigation
  const [mode, setMode] = useState<'visible' | 'hidden' | 'animating'>('visible')

  useSafeLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    // Detect back / forward navigation → keep everything visible, skip all animations
    try {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      if (nav?.type === 'back_forward') return // mode stays 'visible' — no opacity:0, no flash
    } catch { /* unsupported browser, proceed normally */ }

    const vh = window.innerHeight || document.documentElement.clientHeight || 800
    const { top } = el.getBoundingClientRect()

    if (top < vh) {
      // In viewport on first load → trigger entrance animation immediately
      setMode('animating')
      return
    }

    // Below viewport → hide and wait for scroll
    setMode('hidden')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMode('animating')
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        mode === 'hidden'    && 'tj-reveal',
        mode === 'animating' && 'tj-reveal tj-visible',
        // mode === 'visible'  → no class → element fully visible (back-nav / SSR)
        className,
      )}
      style={mode === 'animating' ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
