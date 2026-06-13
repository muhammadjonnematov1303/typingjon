'use client'

import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Settings, Image as ImageIcon, Search, KeyRound, Mail, Lock,
  CheckCircle2, XCircle, Upload, Send, Copy, Check, Globe, Clock,
} from 'lucide-react'
import {
  updateGeneralSettingsAction, updateLogoAction, updateSeoSettingsAction,
} from '@/app/actions/admin-settings'
import { CARD, INPUT, BTN_PRIMARY } from '../../_lib/ui'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/lib/settings'

interface EnvInfo {
  google: { configured: boolean; clientId: string | null; redirectUri: string }
  smtp:   { configured: boolean; from: string | null }
  security: { adminEmail: string | null; sessionDays: number; cookieSecure: boolean }
}

interface Props {
  settings: SiteSettings
  env: EnvInfo
}

const TEXTAREA = INPUT + ' h-auto min-h-[80px] resize-none py-2.5'
const MAX_IMAGE_BYTES = 500 * 1024

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function CardHeader({ icon: Icon, title, desc, color, bg }: {
  icon: React.ElementType; title: string; desc: string; color: string; bg: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', bg)}>
        <Icon className={cn('h-4 w-4', color)} />
      </div>
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        <p className="truncate text-xs text-slate-400">{desc}</p>
      </div>
    </div>
  )
}

function StatusBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
      <CheckCircle2 className="h-3 w-3" />
      Sozlangan
    </span>
  ) : (
    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-400 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-700">
      <XCircle className="h-3 w-3" />
      Sozlanmagan
    </span>
  )
}

function ImagePicker({ label, value, onChange }: {
  label: string; value: string | null; onChange: (dataUrl: string) => void
}) {
  const inputId = `pick-${label.replace(/\s+/g, '-')}`

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Rasm hajmi 500KB dan oshmasligi kerak")
      e.target.value = ''
      return
    }
    onChange(await readImageAsDataUrl(file))
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</label>
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
          {value
            ? <img src={value} alt={label} className="h-full w-full object-contain" />
            : <ImageIcon className="h-5 w-5 text-slate-300" />}
        </div>
        <label htmlFor={inputId}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
          <Upload className="h-3.5 w-3.5" />
          Tanlash
        </label>
        <input id={inputId} type="file" accept="image/*" className="sr-only" onChange={handleFile} />
      </div>
    </div>
  )
}

export function SettingsClient({ settings, env }: Props) {
  // ── Sayt sozlamalari ──
  const [generalState, generalAction, generalPending] = useActionState(updateGeneralSettingsAction, null)
  useEffect(() => {
    if (generalState?.ok) toast.success("Sayt sozlamalari saqlandi")
    if (generalState && 'error' in generalState && generalState.error) toast.error(generalState.error)
  }, [generalState])

  // ── Logo ──
  const [logoState, logoAction, logoPending] = useActionState(updateLogoAction, null)
  const [logoUrl,    setLogoUrl]    = useState(settings.logoUrl ?? '')
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl ?? '')
  useEffect(() => {
    if (logoState?.ok) toast.success("Logo sozlamalari saqlandi")
    if (logoState && 'error' in logoState && logoState.error) toast.error(logoState.error)
  }, [logoState])

  // ── SEO ──
  const [seoState, seoAction, seoPending] = useActionState(updateSeoSettingsAction, null)
  const [ogImageUrl, setOgImageUrl] = useState(settings.ogImageUrl ?? '')
  useEffect(() => {
    if (seoState?.ok) toast.success("SEO sozlamalari saqlandi")
    if (seoState && 'error' in seoState && seoState.error) toast.error(seoState.error)
  }, [seoState])

  // ── Copy redirect URI ──
  const [copied, setCopied] = useState(false)
  async function copyRedirect() {
    try {
      await navigator.clipboard.writeText(env.google.redirectUri)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* ── Sayt sozlamalari ── */}
        <div className={cn(CARD, 'space-y-4 p-5')}>
          <CardHeader icon={Settings} title="Sayt sozlamalari" desc="Nomi, tavsifi va aloqa ma'lumotlari"
            color="text-blue-600" bg="bg-blue-50 dark:bg-blue-500/10" />
          <form action={generalAction} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sayt nomi</label>
              <input name="siteName" defaultValue={settings.siteName} required minLength={2} className={INPUT} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sayt tavsifi</label>
              <textarea name="siteDescription" defaultValue={settings.siteDescription} required minLength={10} rows={3} className={TEXTAREA} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Aloqa email</label>
                <input name="contactEmail" type="email" defaultValue={settings.contactEmail ?? ''}
                  placeholder="muhammadjonnematov1303@gmail.com" className={INPUT} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Telegram bot</label>
                <input name="contactTelegram" defaultValue={settings.contactTelegram ?? ''}
                  placeholder="@typingjonsupport_bot" className={INPUT} />
              </div>
            </div>
            <button type="submit" disabled={generalPending} className={cn(BTN_PRIMARY, 'w-full')}>
              {generalPending ? 'Saqlanmoqda…' : 'Saqlash'}
            </button>
          </form>
        </div>

        {/* ── Logo ── */}
        <div className={cn(CARD, 'space-y-4 p-5')}>
          <CardHeader icon={ImageIcon} title="Logo" desc="Sayt logotipi va favicon"
            color="text-violet-600" bg="bg-violet-50 dark:bg-violet-500/10" />
          <form action={logoAction} className="space-y-3">
            <ImagePicker label="Logo rasmi" value={logoUrl || null} onChange={setLogoUrl} />
            <ImagePicker label="Favicon" value={faviconUrl || null} onChange={setFaviconUrl} />
            <input type="hidden" name="logoUrl" value={logoUrl} readOnly />
            <input type="hidden" name="faviconUrl" value={faviconUrl} readOnly />
            <p className="text-[11px] text-slate-400">PNG yoki SVG, har biri maksimal 500KB</p>
            <button type="submit" disabled={logoPending} className={cn(BTN_PRIMARY, 'w-full')}>
              {logoPending ? 'Saqlanmoqda…' : 'Saqlash'}
            </button>
          </form>
        </div>
      </div>

      {/* ── SEO ── */}
      <div className={cn(CARD, 'space-y-4 p-5')}>
        <CardHeader icon={Search} title="SEO sozlamalari" desc="Qidiruv tizimlari uchun meta ma'lumotlar"
          color="text-amber-600" bg="bg-amber-50 dark:bg-amber-500/10" />
        <form action={seoAction} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">SEO sarlavha</label>
              <input name="seoTitle" defaultValue={settings.seoTitle ?? ''}
                placeholder={settings.siteName} className={INPUT} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Kalit so&apos;zlar</label>
              <input name="seoKeywords" defaultValue={settings.seoKeywords ?? ''}
                placeholder="yozish tezligi, klaviatura, typing" className={INPUT} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">SEO tavsif</label>
            <textarea name="seoDescription" defaultValue={settings.seoDescription ?? ''}
              placeholder={settings.siteDescription} rows={2} className={TEXTAREA} />
          </div>
          <ImagePicker label="OG rasm (ijtimoiy tarmoqlarda ulashganda ko'rinadi)" value={ogImageUrl || null} onChange={setOgImageUrl} />
          <input type="hidden" name="ogImageUrl" value={ogImageUrl} readOnly />
          <button type="submit" disabled={seoPending} className={cn(BTN_PRIMARY, 'w-full sm:w-auto')}>
            {seoPending ? 'Saqlanmoqda…' : 'Saqlash'}
          </button>
        </form>
      </div>

      {/* ── Status panels ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Google OAuth */}
        <div className={cn(CARD, 'space-y-3 p-5')}>
          <div className="flex items-center justify-between gap-2">
            <CardHeader icon={KeyRound} title="Google OAuth" desc="Google orqali kirish"
              color="text-rose-600" bg="bg-rose-50 dark:bg-rose-500/10" />
          </div>
          <StatusBadge ok={env.google.configured} />
          {env.google.configured && (
            <div className="space-y-2 text-xs">
              <div>
                <p className="font-semibold text-slate-500 dark:text-slate-400">Client ID</p>
                <p className="truncate font-mono text-slate-700 dark:text-slate-300">{env.google.clientId}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-500 dark:text-slate-400">Redirect URI</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <code className="min-w-0 flex-1 truncate rounded-lg bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {env.google.redirectUri}
                  </code>
                  <button type="button" onClick={copyRedirect}
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
          <p className="text-[11px] text-slate-400">.env faylidagi GOOGLE_CLIENT_ID/SECRET orqali boshqariladi</p>
        </div>

        {/* SMTP */}
        <div className={cn(CARD, 'space-y-3 p-5')}>
          <CardHeader icon={Mail} title="SMTP sozlamalari" desc="Tasdiqlash xatlarini yuborish"
            color="text-cyan-600" bg="bg-cyan-50 dark:bg-cyan-500/10" />
          <StatusBadge ok={env.smtp.configured} />
          {env.smtp.configured && (
            <div className="text-xs">
              <p className="font-semibold text-slate-500 dark:text-slate-400">Yuboruvchi</p>
              <p className="flex items-center gap-1.5 font-mono text-slate-700 dark:text-slate-300">
                <Send className="h-3 w-3 text-slate-400" />
                {env.smtp.from}
              </p>
            </div>
          )}
          <p className="text-[11px] text-slate-400">.env faylidagi EMAIL_FROM/EMAIL_PASS orqali boshqariladi</p>
        </div>

        {/* Xavfsizlik */}
        <div className={cn(CARD, 'space-y-3 p-5')}>
          <CardHeader icon={Lock} title="Xavfsizlik" desc="Sessiya va kirish siyosati"
            color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-500/10" />
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Globe className="h-3.5 w-3.5" /> Admin email
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{env.security.adminEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Clock className="h-3.5 w-3.5" /> Sessiya muddati
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{env.security.sessionDays} kun</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <KeyRound className="h-3.5 w-3.5" /> Parol siyosati
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">kamida 8 belgi</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Lock className="h-3.5 w-3.5" /> Cookie xavfsizligi
              </span>
              <StatusBadge ok={env.security.cookieSecure} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
