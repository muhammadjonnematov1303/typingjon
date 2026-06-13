import { Mail, Phone, Keyboard } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Reveal } from '@/components/reveal'

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

const navGroups = [
  {
    title: 'Mahsulot',
    links: [
      { label: 'Darslar', href: '#qanday-ishlaydi' },
      { label: 'Reyting', href: '#vitrina' },
      { label: 'Narxlar', href: '#narxlar' },
    ],
  },
  {
    title: 'Kompaniya',
    links: [
      { label: 'Biz haqimizda', href: '#qanday-ishlaydi' },
      { label: 'Aloqa', href: 'mailto:muhammadjonnematov1303@gmail.com' },
    ],
  },
  {
    title: 'Huquqiy',
    links: [
      { label: 'Maxfiylik siyosati', href: '/privacy' },
      { label: 'Foydalanish shartlari', href: '/terms' },
    ],
  },
]

const socials = [
  { label: 'Telegram', href: 'https://t.me/menematov', custom: TelegramIcon, blank: true },
  { label: 'Email', href: 'mailto:muhammadjonnematov1303@gmail.com', icon: Mail, blank: true },
  { label: 'Telefon', href: 'tel:+998955542390', icon: Phone, blank: false },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">

        {/* main row */}
        <Reveal className="grid gap-10 lg:grid-cols-5 lg:gap-12">

          {/* brand */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-muted-foreground">
              Interaktiv darslar va real vaqt tahlili orqali klaviaturada
              tezroq, aniqroq yozing.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.blank ? '_blank' : '_self'}
                  rel={s.blank ? 'noopener noreferrer' : undefined}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  {'custom' in s
                    ? <s.custom className="h-4 w-4" />
                    : <s.icon className="h-4 w-4" />
                  }
                </a>
              ))}
            </div>
          </div>

          {/* nav groups */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:col-span-3">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="font-sans text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="font-sans text-xs text-muted-foreground">
            © {new Date().getFullYear()} Typingjon. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-1.5 font-sans text-xs text-muted-foreground">
            <Keyboard className="h-3.5 w-3.5 text-primary" />
            <span>O&apos;zbek tilida yaratilgan</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
