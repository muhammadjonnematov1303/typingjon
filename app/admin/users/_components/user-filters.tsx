'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, Activity, ArrowUpDown } from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom-select'

const FILTER_BUTTON =
  'h-10 w-full rounded-full px-3.5 text-xs font-semibold dark:bg-slate-950'

const ROLE_OPTIONS = [
  { value: 'all',       label: 'Barcha rollar' },
  { value: 'user',      label: 'Foydalanuvchi' },
  { value: 'moderator', label: 'Mentor' },
  { value: 'admin',     label: 'Admin' },
]
const STATUS_OPTIONS = [
  { value: 'all',    label: 'Barcha holatlar' },
  { value: 'active', label: 'Faol' },
  { value: 'banned', label: 'Bloklangan' },
]
const SORT_OPTIONS = [
  { value: 'desc', label: 'Eng yangi' },
  { value: 'asc',  label: 'Eng eski' },
]

const DEFAULTS: Record<string, string> = { role: 'all', status: 'all', sort: 'desc' }

interface Props {
  role:   string
  status: string
  sort:   string
}

export function UserFilters({ role, status, sort }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function update(key: string, value: string) {
    const sp = new URLSearchParams(searchParams.toString())
    if (value === DEFAULTS[key]) sp.delete(key); else sp.set(key, value)
    sp.delete('page')
    const qs = sp.toString()
    router.push(qs ? `/admin/users?${qs}` : '/admin/users')
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:ml-auto sm:flex sm:flex-wrap sm:items-center">
      <CustomSelect
        name="role"
        icon={Shield}
        options={ROLE_OPTIONS}
        value={role}
        onChange={v => update('role', v)}
        className="w-full sm:w-[160px]"
        buttonClassName={FILTER_BUTTON}
      />
      <CustomSelect
        name="status"
        icon={Activity}
        options={STATUS_OPTIONS}
        value={status}
        onChange={v => update('status', v)}
        className="w-full sm:w-[160px]"
        buttonClassName={FILTER_BUTTON}
      />
      <CustomSelect
        name="sort"
        icon={ArrowUpDown}
        options={SORT_OPTIONS}
        value={sort}
        onChange={v => update('sort', v)}
        className="w-full sm:w-[150px]"
        buttonClassName={FILTER_BUTTON}
      />
    </div>
  )
}
