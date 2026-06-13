import { Suspense } from 'react'
import VerifyEmailClient from './client'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    }>
      <VerifyEmailClient />
    </Suspense>
  )
}
