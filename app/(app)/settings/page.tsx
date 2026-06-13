import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { SettingsClient } from './_components/settings-client'

async function getUser() {
  const userId = await getSession()
  if (!userId) redirect('/login')
  const db = getDb()
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) redirect('/login')
  return user
}

export default async function SettingsPage() {
  const user = await getUser()

  return (
    <SettingsClient
      initial={{
        name:      user.name,
        email:     user.email,
        image:     user.image ?? null,
        createdAt: user.createdAt.toISOString(),
      }}
    />
  )
}
