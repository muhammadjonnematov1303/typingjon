import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Yozish testi' }

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
