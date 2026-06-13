'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export function GlassCard({ children, className, intensity = 12 }: GlassCardProps) {
  const ref  = useRef<HTMLDivElement>(null)
  const raf  = useRef<number>(0)

  const [tilt,  setTilt]  = useState({ rx: 0, ry: 0, active: false })
  const [shine, setShine] = useState({ x: 50, y: 50 })

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return
      const { left, top, width, height } = el.getBoundingClientRect()
      const x = e.clientX - left
      const y = e.clientY - top
      setTilt({
        rx: ((y - height / 2) / (height / 2)) * -intensity,
        ry: ((x - width  / 2) / (width  / 2)) *  intensity,
        active: true,
      })
      setShine({ x: (x / width) * 100, y: (y / height) * 100 })
    })
  }

  function onLeave() {
    cancelAnimationFrame(raf.current)
    setTilt({ rx: 0, ry: 0, active: false })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn('relative', className)}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.active ? 1.03 : 1})`,
        transformStyle: 'preserve-3d',
        transition: tilt.active
          ? 'transform 0.08s ease-out'
          : 'transform 0.55s cubic-bezier(0.23,1,0.32,1)',
        willChange: 'transform',
      }}
    >
      {children}

      {/* Moving shine */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.22) 0%, transparent 55%)`,
          opacity: tilt.active ? 1 : 0,
          transition: 'opacity 0.35s ease',
          zIndex: 10,
        }}
      />

      {/* Edge highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(135deg,rgba(255,255,255,0.10) 0%,transparent 40%,transparent 60%,rgba(255,255,255,0.05) 100%)`,
          opacity: tilt.active ? 1 : 0,
          transition: 'opacity 0.35s ease',
          zIndex: 10,
        }}
      />
    </div>
  )
}
