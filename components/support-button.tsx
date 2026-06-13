'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { SupportModal } from './support-modal'

export function SupportButton() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // The customer-support widget belongs to the public/app side, not the admin panel
  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Murojaat yuborish"
        title="Murojaat yuborish"
        className="group fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40"
      >
        <MessageCircle className="h-5 w-5 text-white" />
        {/* Pulse ring */}
        <span className="absolute h-full w-full animate-ping rounded-full bg-blue-400 opacity-20" />
      </button>

      <SupportModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
