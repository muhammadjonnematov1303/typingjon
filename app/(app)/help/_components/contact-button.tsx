'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { SupportModal } from '@/components/support-modal'

export function ContactButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700"
      >
        <MessageCircle className="h-4 w-4" />
        Murojaat yuborish
      </button>
      <SupportModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
