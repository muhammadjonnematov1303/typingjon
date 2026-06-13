import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/logo'

const sections = [
  {
    title: '1. Yig\'iladigan ma\'lumotlar',
    body: [
      'Ro\'yxatdan o\'tish vaqtida: ism, email manzil va parol (shifrlangan holda).',
      'Mashq ma\'lumotlari: yozish tezligi (WPM), aniqlik foizi, mashq davomiyligi va vaqti.',
      'Texnik ma\'lumotlar: IP manzil, brauzer turi, qurilma modeli va operatsion tizim.',
      'Faoliyat ma\'lumotlari: qaysi darslarni bajarganingiz, natijalaringiz va yutug\'laringiz.',
    ],
  },
  {
    title: '2. Ma\'lumotlardan foydalanish',
    body: [
      'Shaxsiy o\'rganish yo\'l xaritasini tayyorlash va tavsiyalar berish uchun.',
      'Xizmat sifatini oshirish, xatolarni tuzatish va yangi funksiyalar qo\'shish uchun.',
      'Muhim yangiliklar, xavfsizlik ogohlantirishlari va hisob ma\'lumotlarini yetkazish uchun.',
      'Anonim statistika tahlili — bu ma\'lumotlar hech qachon shaxsiy identifikatsiya uchun ishlatilmaydi.',
    ],
  },
  {
    title: '3. Ma\'lumotlar xavfsizligi',
    body: [
      'Barcha ma\'lumotlar AES-256 shifrlash bilan himoyalangan serverda saqlanadi.',
      'Parollar bcrypt algoritmi yordamida bir tomonlama (one-way) shifrlanadi.',
      'HTTPS protokoli orqali barcha ma\'lumot uzatishlari himoyalangan.',
      'Muntazam xavfsizlik tekshiruvlari va monitoring tizimi joriy etilgan.',
    ],
  },
  {
    title: '4. Ma\'lumotlarni uchinchi taraflarga berish',
    body: [
      'Biz sizning shaxsiy ma\'lumotlaringizni hech qachon sotmaymiz yoki ijaraga bermaymiz.',
      'Faqat xizmat ko\'rsatuvchi hamkorlar (server, to\'lov tizimi) zaruriy ma\'lumotlarga ega bo\'ladi.',
      'Qonun talabi yoki sud buyrug\'i bo\'lganda tegishli organlarga ma\'lumot taqdim etilishi mumkin.',
    ],
  },
  {
    title: '5. Cookie va kuzatuv',
    body: [
      'Sessiya cookie\'lari: tizimga kirish holatini saqlash uchun ishlatiladi.',
      'Analitika cookie\'lari: xizmat sifatini oshirish maqsadida anonim statistika yig\'ish uchun.',
      'Brauzer sozlamalarida cookie\'larni o\'chirish mumkin, lekin bu ba\'zi funksiyalarni cheklashi mumkin.',
    ],
  },
  {
    title: '6. Foydalanuvchi huquqlari',
    body: [
      'Ma\'lumotlaringizni ko\'rish: hisob sozlamalaridan shaxsiy ma\'lumotlaringizni ko\'rishingiz mumkin.',
      'Ma\'lumotlarni o\'chirish: hisobingizni o\'chirganingizda barcha shaxsiy ma\'lumotlar 30 kun ichida o\'chiriladi.',
      'Ma\'lumotlarni eksport qilish: statistika va natijalaringizni JSON formatda yuklab olishingiz mumkin.',
      'Reklama emaillardan voz kechish: istagan vaqt obunani bekor qilishingiz mumkin.',
    ],
  },
  {
    title: '7. Bolalar maxfiyligi',
    body: [
      'Typingjon 13 yoshdan kichik bolalardan ongli ravishda ma\'lumot to\'lamaydi.',
      'Agar ota-ona/vasiy 13 yoshdan kichik farzandining ma\'lumotlari yig\'ilganini aniqlasa, bizga xabar bering — darhol o\'chiramiz.',
    ],
  },
  {
    title: '8. Siyosatdagi o\'zgarishlar',
    body: [
      'Maxfiylik siyosati yangilanganda email orqali xabar beriladi va saytda e\'lon qilinadi.',
      'Yangilangan siyosatdan keyin platformadan foydalanish uni qabul qilish deb hisoblanadi.',
    ],
  },
]

export default function PrivacyPage() {
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
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-green-500/10">
            <ShieldCheck className="h-7 w-7 text-green-600" />
          </div>
          <div>
            <h1 className="font-sans text-3xl font-bold text-foreground">Maxfiylik siyosati</h1>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              Oxirgi yangilanish: 10-iyun 2026 &nbsp;·&nbsp; Typingjon
            </p>
          </div>
        </div>

        {/* Intro */}
        <div className="mb-10 rounded-2xl border border-green-500/20 bg-green-500/5 p-5 sm:p-6">
          <p className="font-sans text-sm leading-relaxed text-foreground">
            Typingjon sizning maxfiyligingizni jiddiy qabul qiladi. Ushbu siyosat qanday
            ma&apos;lumotlar yig&apos;ilishi, qanday ishlatilishi va qanday himoyalanishi haqida
            to&apos;liq ma&apos;lumot beradi. Savollaringiz bo&apos;lsa{' '}
            <a href="mailto:muhammadjonnematov1303@gmail.com" className="font-semibold text-green-600">
              muhammadjonnematov1303@gmail.com
            </a>
            {' '}ga murojaat qiling.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="group rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-green-500/20 hover:shadow-md hover:shadow-green-500/5">
              <h2 className="mb-4 font-sans text-base font-bold text-foreground">
                {section.title}
              </h2>
              <ul className="space-y-2.5">
                {section.body.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500/60" />
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
            Maxfiylik bo&apos;yicha savollar uchun:{' '}
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
