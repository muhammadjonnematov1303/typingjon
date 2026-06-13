import {
  HelpCircle, BookOpen, Zap, BarChart2, Settings,
  ChevronRight, Keyboard, Clock, Type, Quote,
  Wind, Wrench, Target, TrendingUp,
  MessageCircle, ExternalLink, Info,
  RotateCcw, Play, Pause, Hash, CheckCircle2,
} from 'lucide-react'
import { ContactButton } from './_components/contact-button'

// ─── Quick-link cards ──────────────────────────────────────────────────────────
const QUICK_LINKS = [
  {
    href:    '/lessons',
    icon:    <BookOpen className="h-5 w-5" />,
    color:   'bg-violet-50 text-violet-600',
    border:  'border-violet-100',
    title:   'Darslar',
    desc:    'Bosqichma-bosqich mashqlar',
  },
  {
    href:    '/test',
    icon:    <Zap className="h-5 w-5" />,
    color:   'bg-blue-50 text-blue-600',
    border:  'border-blue-100',
    title:   'Yozish testi',
    desc:    '5 xil rejimda tezlikni sinash',
  },
  {
    href:    '/stats',
    icon:    <BarChart2 className="h-5 w-5" />,
    color:   'bg-emerald-50 text-emerald-600',
    border:  'border-emerald-100',
    title:   'Statistika',
    desc:    'Natijalar va taraqqiyot grafigi',
  },
  {
    href:    '/settings',
    icon:    <Settings className="h-5 w-5" />,
    color:   'bg-amber-50 text-amber-600',
    border:  'border-amber-100',
    title:   'Sozlamalar',
    desc:    'Profil va parol o\'zgartirish',
  },
]

// ─── Getting-started steps ────────────────────────────────────────────────────
const STEPS = [
  {
    n:    '1',
    icon: <BookOpen className="h-5 w-5 text-violet-500" />,
    bg:   'bg-violet-50',
    title: 'Darslarni boshlang',
    desc:  'Sidebar\'dan «Darslar» sahifasiga o\'ting. 1-darsdan boshlang — asosiy qator (a s d f j k l). Har bir darsni yakunlash keyingisini ochadi.',
  },
  {
    n:    '2',
    icon: <Zap className="h-5 w-5 text-blue-500" />,
    bg:   'bg-blue-50',
    title: 'Yozish testini sinab ko\'ring',
    desc:  '«Yozish testi» sahifasida o\'z tezligingizni o\'lchang. Standart: 60 soniya «Vaqt» rejimi. WPM (so\'z/daqiqa) va aniqlik real vaqtda ko\'rsatiladi.',
  },
  {
    n:    '3',
    icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
    bg:   'bg-emerald-50',
    title: 'Statistikani kuzating',
    desc:  '«Statistika» sahifasida yozish tezligingiz vaqt o\'tishi bilan qanday o\'sganini, eng yaxshi natijalaringizni va darslar tarixini kuzating.',
  },
  {
    n:    '4',
    icon: <Target className="h-5 w-5 text-rose-500" />,
    bg:   'bg-rose-50',
    title: 'Reytingda o\'rningizni toping',
    desc:  '«Reyting» sahifasida boshqa foydalanuvchilar bilan eng yuqori WPM ko\'rsatkichingiz bo\'yicha taqqoslaning.',
  },
]

// ─── Test modes ───────────────────────────────────────────────────────────────
const MODES = [
  {
    icon:  <Clock className="h-4 w-4" />,
    color: 'bg-blue-50 text-blue-600 ring-blue-100',
    name:  'Vaqt',
    desc:  'Belgilangan vaqt (15/30/60/120 soniya) ichida imkon qadar ko\'p va to\'g\'ri yozing. Vaqt tugaganda natija chiqadi.',
  },
  {
    icon:  <Hash className="h-4 w-4" />,
    color: 'bg-violet-50 text-violet-600 ring-violet-100',
    name:  'So\'zlar',
    desc:  'Belgilangan miqdordagi so\'zlarni (10/25/50/100) yozing. So\'nggi so\'z yozilganda test tugaydi.',
  },
  {
    icon:  <Quote className="h-4 w-4" />,
    color: 'bg-amber-50 text-amber-600 ring-amber-100',
    name:  'Iqtibos',
    desc:  'Mashhur iqtiboslardan birini yozing. Uzunligi iqtibosga qarab farq qiladi — mazmunli mashq uchun qulay.',
  },
  {
    icon:  <Wind className="h-4 w-4" />,
    color: 'bg-sky-50 text-sky-600 ring-sky-100',
    name:  'Zen',
    desc:  'Cheksiz matn, vaqtsiz, natijasiz. Faqat jarayon — xotirojam mashq yoki isish uchun ideal.',
  },
  {
    icon:  <Wrench className="h-4 w-4" />,
    color: 'bg-rose-50 text-rose-600 ring-rose-100',
    name:  'Maxsus matn',
    desc:  'O\'z matningizni kiriting — taqdimot, eslatma, lug\'at — va xuddi shu matn bilan mashq qiling.',
  },
]

// ─── Keyboard shortcuts ───────────────────────────────────────────────────────
const SHORTCUTS = [
  { keys: ['Tab'],          desc: 'Testni qayta boshlash (natija ko\'rsatilganda)' },
  { keys: ['Escape'],       desc: 'Zen rejimidan chiqish' },
  { keys: ['Har qanday'],   desc: 'Birinchi tugma bosishda test avtomatik boshlanadi' },
]

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'WPM nima va qanday hisoblanadi?',
    a: 'WPM — Words Per Minute (so\'z/daqiqa). Hisoblash usuli: yozilgan belgilar soni ÷ 5 ÷ vaqt (daqiqada). 5 belgiga bo\'lish standart «o\'rtacha so\'z uzunligi» sifatida qabul qilingan. Masalan, 60 soniyada 200 belgi yozsangiz → 200 ÷ 5 ÷ 1 = 40 WPM.',
  },
  {
    q: 'Aniqlik qanday hisoblanadi?',
    a: 'Aniqlik (%) = (To\'g\'ri bosgan belgilar / Jami yozilgan belgilar) × 100. Tuzatilgan xatolar ham hisobga olinadi — agar xato bosgandan keyin o\'chirib to\'g\'rilab olsangiz, bu «Tuzatilgan» belgisi sifatida amber rangda ko\'rsatiladi.',
  },
  {
    q: 'Izchillik (consistency) nima?',
    a: 'Izchillik — har 1 soniyada hisoblangan WPM namunalarining standart og\'ishini o\'lchaydi. 100% — har soniyada bir xil tezlik; past qiymat — tezlik sezilarli o\'zgarib turgan. Professional terzlar odatda 80%+ izchillikka ega.',
  },
  {
    q: 'Qulfli darslarni qanday ochaman?',
    a: 'Darslar ketma-ket ochiladi: 1-darsni yakunlasangiz 2-dars ochiladi, 2-darsni yakunlasangiz 3-dars ochiladi va hokazo. Har bir darsni kamida bir marta to\'liq yozib chiqish kifoya.',
  },
  {
    q: 'Tez yozganimda xatolar ko\'payib ketadi — nega?',
    a: 'Bu holat ilgari mavjud edi, ammo tuzatildi. Agar hali ham shunday ko\'rsangiz, sahifani yangilang (F5). Eski kesh saqlanib qolgan bo\'lishi mumkin.',
  },
  {
    q: 'Parolimni unutdim, nima qilaman?',
    a: 'Kirish sahifasidagi «Parolni unutdingizmi?» havolasiga bosing — elektron pochtangizga parolni tiklash kodi yuboriladi. Agar xat kelmasa, spam papkasini tekshiring.',
  },
  {
    q: 'Natijalarim saqlanmayaptimi?',
    a: 'Natijalar faqat dars yoki yozish testi to\'liq yakunlanganda saqlanadi. «Yozish testi» sahifasida «Vaqt» va «So\'zlar» rejimlari yakunida avtomatik saqlanadi. Agar sahifadan chiqib ketsangiz — test natijasi saqlanmaydi.',
  },
]

export default function HelpPage() {
  return (
    <div className="space-y-8 p-6">

      {/* ── Header ── */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm shadow-blue-200">
          <HelpCircle className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Yordam markazi</h1>
          <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-500">
            Typingjon haqida hamma narsani shu yerdan toping
          </p>
        </div>
      </div>

      {/* ── Quick links ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <ChevronRight className="h-3.5 w-3.5" />
          Tezkor havolalar
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map(l => (
            <a key={l.href} href={l.href}
              className={`group flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${l.border}`}>
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${l.color}`}>
                {l.icon}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{l.title}</div>
                <div className="truncate text-xs text-slate-400 dark:text-slate-500">{l.desc}</div>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0 text-slate-300 transition-transform dark:text-slate-600 group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </section>

      {/* ── Getting started ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <ChevronRight className="h-3.5 w-3.5" />
          Boshlash qo&apos;llanmasi
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {STEPS.map(s => (
            <div key={s.n} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                {s.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-slate-300">{s.n}</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{s.title}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Test modes ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <ChevronRight className="h-3.5 w-3.5" />
          Test rejimlari
        </h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {MODES.map((m, i) => (
            <div key={m.name}
              className={`flex items-start gap-4 p-5 ${i < MODES.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
              <span className={`mt-0.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ${m.color}`}>
                {m.icon}
                {m.name}
              </span>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Keyboard shortcuts ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <ChevronRight className="h-3.5 w-3.5" />
          Klaviatura yorliqlari
        </h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {SHORTCUTS.map((s, i) => (
            <div key={i}
              className={`flex items-center gap-4 px-5 py-3.5 ${i < SHORTCUTS.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
              <div className="flex flex-shrink-0 items-center gap-1.5">
                {s.keys.map(k => (
                  <kbd key={k}
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-bold text-slate-700 shadow-[0_2px_0_0_#e2e8f0] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:shadow-[0_2px_0_0_#0f172a]">
                    {k}
                  </kbd>
                ))}
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-300">{s.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Statistika tushuntirishi ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <ChevronRight className="h-3.5 w-3.5" />
          Ko&apos;rsatkichlar nima degani?
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: <Zap className="h-4 w-4" />, bg: 'bg-blue-50', color: 'text-blue-600', label: 'WPM', full: 'Words Per Minute', desc: 'Daqiqadagi so\'z soni (har 5 belgi = 1 so\'z)' },
            { icon: <Target className="h-4 w-4" />, bg: 'bg-emerald-50', color: 'text-emerald-600', label: 'Aniqlik', full: 'Accuracy', desc: 'To\'g\'ri bosilgan belgilarning foizi' },
            { icon: <TrendingUp className="h-4 w-4" />, bg: 'bg-violet-50', color: 'text-violet-600', label: 'Izchillik', full: 'Consistency', desc: 'Tezlikdagi barqarorlik darajasi (%)' },
          ].map(m => (
            <div key={m.label} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${m.bg} ${m.color}`}>
                {m.icon}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{m.label}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{m.full}</div>
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <ChevronRight className="h-3.5 w-3.5" />
          Tez-tez so&apos;raladigan savollar
        </h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {FAQS.map((f, i) => (
            <details key={i}
              className={`group ${i < FAQS.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 select-none hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{f.q}</span>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-90 dark:text-slate-500" />
              </summary>
              <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/30">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <ChevronRight className="h-3.5 w-3.5" />
          Bog&apos;lanish
        </h2>
        <div className="flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <MessageCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Savollaringiz qoldimi?</div>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                Ushbu sahifada javob topa olmagan bo&apos;lsangiz, murojaat formi orqali xabar qoldiring
              </p>
            </div>
          </div>
          <ContactButton />
        </div>

        {/* Info note */}
        <div className="mt-3 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 px-5 py-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
          <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300">
            Typingjon hali faol rivojlanish bosqichida. Muammo yoki taklif topilsa — bildiring, tezda tuzatamiz.
            Foydalanuvchi ma&apos;lumotlari xavfsiz saqlanadi va uchinchi tomonlarga berilmaydi.
          </p>
        </div>
      </section>

    </div>
  )
}
