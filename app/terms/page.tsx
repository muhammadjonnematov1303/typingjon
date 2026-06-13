import { FileText, ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/logo'

const sections = [
  {
    title: '1. Xizmatdan foydalanish',
    body: [
      'Typingjon platformasidan foydalanish uchun kamida 13 yoshda bo\'lishingiz shart.',
      'Ro\'yxatdan o\'tish vaqtida to\'g\'ri va to\'liq ma\'lumot taqdim etishingiz kerak.',
      'Hisobingiz xavfsizligi va maxfiyligini ta\'minlash sizning mas\'uliyatingizdir.',
      'Bir kishi bir nechta hisob yarata olmaydi.',
    ],
  },
  {
    title: '2. Ruxsat etilmagan harakatlar',
    body: [
      'Platformani buzish, xakerlik yoki ruxsatsiz kirish urinishlari qat\'iyan taqiqlangan.',
      'Boshqa foydalanuvchilarga bezovtalik yoki zarar yetkazuvchi harakatlar man etiladi.',
      'Avtomatlashtirilgan skript, bot yoki dasturlar orqali sun\'iy natijalar qo\'yish taqiqlangan.',
      'Platformaning manba kodini qayta tarqatish yoki tijorat maqsadida ishlatish mumkin emas.',
    ],
  },
  {
    title: '3. Kontent va intellektual mulk',
    body: [
      'Typingjon platformasidagi barcha kontent — darslar, dizayn, kod — bizning mulkimizdir.',
      'Siz platformada yaratgan natijalaringiz va statistikangiz sizga tegishli bo\'lib qoladi.',
      'Platformadan olingan materiallarni iqtibos qilishda manba ko\'rsatilishi shart.',
    ],
  },
  {
    title: '4. Obuna va to\'lovlar',
    body: [
      'Bepul tarif cheksiz muddatga bepul saqlanadi va asosiy funksiyalar mavjud bo\'ladi.',
      'Pro tarif oylik to\'lov asosida taqdim etiladi. To\'lovlar qaytarilmaydi.',
      'Obunani istalgan vaqt bekor qilish mumkin; joriy davr oxirigacha xizmat davom etadi.',
      'Narxlar oldindan xabar berilgan holda o\'zgartirilishi mumkin.',
    ],
  },
  {
    title: '5. Xizmatni to\'xtatish',
    body: [
      'Qoidalarni buzgan foydalanuvchilarning hisobi ogohlantirishsiz o\'chirilishi mumkin.',
      'Biz platformani texnik sabablarga ko\'ra vaqtincha to\'xtatish huquqini saqlab qolamiz.',
      'Foydalanuvchi o\'z hisobini istalgan vaqt o\'chirishi mumkin.',
    ],
  },
  {
    title: '6. Javobgarlikni cheklash',
    body: [
      'Typingjon xizmat uzilishlari, ma\'lumot yo\'qolishi yoki vaqtinchalik nosozliklar uchun javob bermaydi.',
      'Platforma "xuddi shundayligicha" (as-is) taqdim etiladi va hech qanday kafolat berilmaydi.',
      'Uchinchi tomon xizmatlar (to\'lov tizimlari va boshqalar) bilan bog\'liq muammolar uchun javobgar emasmiz.',
    ],
  },
  {
    title: '7. O\'zgartirishlar',
    body: [
      'Ushbu shartlar istalgan vaqt yangilanishi mumkin. Muhim o\'zgarishlar haqida email orqali xabar beriladi.',
      'Yangilangan shartlardan keyin platformadan foydalanish yangi shartlarni qabul qilish deb hisoblanadi.',
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 font-sans text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Orqaga
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Hero */}
        <div className="mb-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="font-sans text-3xl font-bold text-foreground">Foydalanish shartlari</h1>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              Oxirgi yangilanish: 10-iyun 2026 &nbsp;·&nbsp; Typingjon
            </p>
          </div>
        </div>

        {/* Intro */}
        <div className="mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
          <p className="font-sans text-sm leading-relaxed text-foreground">
            Typingjon platformasidan foydalanishdan oldin quyidagi shartlarni diqqat bilan o&apos;qing.
            Platformadan foydalanish orqali siz ushbu shartlarga to&apos;liq rozi bo&apos;lasiz.
            Savollaringiz bo&apos;lsa{' '}
            <a href="mailto:muhammadjonnematov1303@gmail.com" className="font-semibold text-primary">
              muhammadjonnematov1303@gmail.com
            </a>
            {' '}ga murojaat qiling.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="group rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5">
              <h2 className="mb-4 font-sans text-base font-bold text-foreground">
                {section.title}
              </h2>
              <ul className="space-y-2.5">
                {section.body.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
                    <span className="font-sans text-sm leading-relaxed text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-5 text-center">
          <p className="font-sans text-sm text-muted-foreground">
            Savol yoki shikoyatlar uchun:{' '}
            <a href="mailto:muhammadjonnematov1303@gmail.com" className="font-semibold text-primary">
              muhammadjonnematov1303@gmail.com
            </a>
          </p>
          <p className="mt-2 font-sans text-xs text-muted-foreground/60">
            © 2026 Typingjon. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </main>
    </div>
  )
}
