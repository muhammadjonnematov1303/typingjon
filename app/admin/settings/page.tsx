import { Settings } from 'lucide-react'
import { getSiteSettings } from '@/lib/settings'
import { ADMIN_EMAIL } from '@/lib/admin'
import { PAGE_TITLE, PAGE_SUBTITLE } from '../_lib/ui'
import { SettingsClient } from './_components/settings-client'
import { SettingsGate } from './_components/settings-gate'
import { DangerZone } from './_components/danger-zone'

function maskSecret(value: string | undefined, head = 6, tail = 4) {
  if (!value) return null
  if (value.length <= head + tail) return '•'.repeat(value.length)
  return `${value.slice(0, head)}${'•'.repeat(8)}${value.slice(-tail)}`
}

function maskEmail(value: string | undefined) {
  if (!value) return null
  const [user, domain] = value.split('@')
  if (!domain) return maskSecret(value)
  const visible = user.slice(0, 2)
  return `${visible}${'•'.repeat(Math.max(3, user.length - 2))}@${domain}`
}

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()
  const appUrl   = process.env.NEXT_PUBLIC_APP_URL ?? ''

  const env = {
    google: {
      configured:  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
      clientId:    maskSecret(process.env.GOOGLE_CLIENT_ID, 12, 4),
      redirectUri: appUrl ? `${appUrl}/api/auth/callback/google` : '/api/auth/callback/google',
    },
    smtp: {
      configured: !!process.env.EMAIL_FROM && !!process.env.EMAIL_PASS,
      from:       maskEmail(process.env.EMAIL_FROM),
    },
    security: {
      adminEmail:   maskEmail(ADMIN_EMAIL),
      sessionDays:  30,
      cookieSecure: process.env.NODE_ENV === 'production',
    },
  }

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className={PAGE_TITLE}>
          <Settings className="h-5 w-5 text-blue-600" />
          Sozlamalar
        </h1>
        <p className={PAGE_SUBTITLE}>Platforma darajasidagi sozlamalar</p>
      </div>

      <SettingsGate>
        <SettingsClient settings={settings} env={env} />
        <DangerZone />
      </SettingsGate>
    </div>
  )
}
