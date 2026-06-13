import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { getSiteSettings } from '@/lib/settings'
import { Mail, MessageCircle, Clock, MapPin, Send } from 'lucide-react'
import { ContactForm } from './_components/contact-form'

async function getOptionalUser() {
  const userId = await getSession()
  if (!userId) return null
  const db   = getDb()
  const user = await db.user.findUnique({
    where:  { id: userId },
    select: { name: true },
  })
  return user
}

const FAQS = [
  {
    q: "Parolimni unutdim, nima qilaman?",
    a: "Kirish sahifasidagi 'Parolni unutdim' tugmasini bosing yoki email orqali biz bilan bog'laning.",
  },
  {
    q: "Yangi darslar qachon qo'shiladi?",
    a: "Yangi darslar muntazam ravishda qo'shib boriladi. Yangilanishlardan xabardor bo'lish uchun kuzatib boring.",
  },
  {
    q: "Hisobimni o'chirmoqchiman",
    a: "Hisob o'chirish uchun email orqali murojaat qiling. So'rovingizni 48 soat ichida ko'rib chiqamiz.",
  },
]

export default async function ContactPage() {
  const [user, settings] = await Promise.all([getOptionalUser(), getSiteSettings()])

  const contactEmail    = settings.contactEmail || 'muhammadjonnematov1303@gmail.com'
  const contactTelegram = settings.contactTelegram || '@typingjonsupport_bot'
  const telegramHref    = `https://t.me/${contactTelegram.replace(/^@/, '')}`

  const CONTACT_ITEMS = [
    {
      icon: MessageCircle,
      label: 'Telegram bot',
      value: contactTelegram,
      href: telegramHref,
      desc: "Tezkor yordam uchun",
    },
    {
      icon: Mail,
      label: 'Email',
      value: contactEmail,
      href: `mailto:${contactEmail}`,
      desc: 'Savol va takliflar uchun',
    },
    {
      icon: Clock,
      label: 'Javob vaqti',
      value: '24 soat ichida',
      href: null,
      desc: 'Ish kunlari 09:00 — 18:00',
    },
    {
      icon: MapPin,
      label: 'Manzil',
      value: "O'zbekiston, Buxoro",
      href: null,
      desc: '',
    },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">

      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
          <Mail className="h-5 w-5 text-blue-600" />
          Bog&apos;lanish
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Savol yoki takliflaringiz bo&apos;lsa, biz bilan bog&apos;laning
        </p>
      </div>

      {/* Contact cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {CONTACT_ITEMS.map(({ icon: Icon, label, value, href, desc }) => (
          <div key={label}
            className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
              {href ? (
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  className="mt-0.5 block truncate text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400">
                  {value}
                </a>
              ) : (
                <p className="mt-0.5 text-sm font-semibold text-slate-700 dark:text-slate-200">{value}</p>
              )}
              {desc && <p className="mt-0.5 text-xs text-slate-400">{desc}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Telegram CTA */}
      <a href={telegramHref} target="_blank" rel="noreferrer"
        className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 transition-colors hover:bg-blue-100/60 dark:border-blue-800/40 dark:bg-blue-950/30 dark:hover:bg-blue-900/30">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-blue-800 dark:text-blue-200">
            Telegram bot orqali murojaat
          </p>
          <p className="mt-0.5 text-xs text-blue-600 dark:text-blue-400">
            {contactTelegram} — tezkor va qulay
          </p>
        </div>
        <Send className="h-4 w-4 flex-shrink-0 text-blue-500" />
      </a>

      {/* Contact form */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700/60">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
            <Send className="h-4 w-4 text-blue-500" />
            Murojaat yuborish
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">Xabaringiz bot orqali yetkaziladi</p>
        </div>
        <div className="p-5">
          <ContactForm defaultName={user?.name ?? ''} />
        </div>
      </div>

      {/* FAQ */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700/60">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Ko&apos;p so&apos;raladigan savollar
          </h2>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="px-5 py-4">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{q}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
