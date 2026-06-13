﻿'use client'

import { useState } from 'react'
import { Zap, Target, Flame, Trophy, TrendingUp, Gamepad2, ArrowRight, X, Check } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { GlassCard } from '@/components/glass-card'

type Feature = {
  icon: React.ElementType
  title: string
  desc: string
  longDesc: string
  points: string[]
}

const features: Feature[] = [
  {
    icon: Zap,
    title: 'Real vaqt tahlili',
    desc: "Har bir tugmachani bosishda xatolarni darhol aniqlab, tuzatib boring.",
    longDesc: "Yozish jarayonida har bir bosilgan tugma tahlil qilinadi. Xato harflar darhol belgilanib, to'g'ri variant ko'rsatiladi. Bu sizga mashq paytida ongli ravishda takomillashish imkonini beradi.",
    points: [
      "Har bir tugma bosimida millisekundlar ichida natija",
      "Xato harflarni rang bilan ajratib ko'rsatish",
      "WPM (so'z/daqiqa) real vaqtda hisoblash",
      "Eng ko'p xato qilinadigan harflar statistikasi",
    ],
  },
  {
    icon: Target,
    title: 'Aniqlik nazorati',
    desc: "Har bir belgi uchun batafsil aniqlik tahlili va shaxsiy statistika.",
    longDesc: "Shaxsiy aniqlik hisobotingiz har bir harf va belgi uchun alohida tahlil qiladi. Qaysi harflarda ko'proq xato qilishingizni bilib, maqsadli mashq qilishingiz mumkin.",
    points: [
      "Harf bo'yicha aniqlik foizi",
      "Haftalik va oylik aniqlik grafigi",
      "Eng zaif tomonlarni avtomatik aniqlash",
      "Shaxsiy o'rganish yo'l xaritasi",
    ],
  },
  {
    icon: Flame,
    title: 'Kunlik seriya',
    desc: "Har kuni mashq qilib, o'z ketma-ketligingizni saqlang va motivatsiyangizni oshiring.",
    longDesc: "Kunlik seriya tizimi sizni har kuni mashq qilishga undaydi. Uzluksiz kunlar soni oshgan sari maxsus mukofotlar va badge'lar qo'lga kiritasiz. Bir kun o'tkazib yubormang!",
    points: [
      "Kunlik 5 daqiqalik minimal mashq maqsadi",
      "Seriya uzilsa ogohlantirish xabari",
      "Eng uzun seriya rekordini saqlash",
      "Maxsus seriya badge va mukofotlar",
    ],
  },
  {
    icon: Trophy,
    title: 'Reyting tizimi',
    desc: "Global reyting jadvalidagi boshqa foydalanuvchilar bilan bellashing.",
    longDesc: "Dunyo bo'ylab minglab foydalanuvchilar bilan raqobatlashing. Haftalik turnirlar, do'stlar bilan to'g'ridan-to'g'ri musobaqalar va global liderlar jadvali sizni doim ilhomlantiradi.",
    points: [
      "Global, milliy va do'stlar reytingi",
      "Haftalik va oylik musobaqa turniri",
      "Liga tizimi: bronza → kumush → oltin → olmos",
      "Top 100 uchun maxsus sovrinlar",
    ],
  },
  {
    icon: TrendingUp,
    title: 'Rivojlanish statistikasi',
    desc: "Batafsil grafiklar va tahlillar orqali uzoq muddatli taraqqiyotingizni kuzating.",
    longDesc: "Oylar davomidagi rivojlanishingizni interaktiv grafiklar orqali ko'ring. Qaysi kuni eng yaxshi natija ko'rsatganingiz, qaysi soatda eng unumdorligingiz va boshqa qiziqarli ma'lumotlar.",
    points: [
      "7 kunlik, oylik va yillik rivojlanish grafigi",
      "WPM va aniqlik tendensiyasi",
      "Eng samarali mashq vaqtini aniqlash",
      "Maqsad qo'yish va kuzatish vositasi",
    ],
  },
  {
    icon: Gamepad2,
    title: "O'yinlashtirilgan o'rganish",
    desc: "XP toping, yutuqlarga erishing va mahoratingizni oshirgan sari yangi darajalarga o'ting.",
    longDesc: "O'rganish jarayonini o'yinga aylantiring. Har bir mashqdan XP ball to'plang, maxsus vazifalarni bajaring va 50 dan ortiq yutuqni qo'lga kiriting. Yangi daraja - yangi imkoniyatlar!",
    points: [
      "50+ noyob yutuq va badge'lar",
      "Daraja tizimi: Yangi boshlovchi → Master",
      "Kunlik va haftalik maxsus vazifalar",
      "Do'stlarga XP sovg'a qilish imkoni",
    ],
  },
]

function FeatureModal({ feature, onClose }: { feature: Feature; onClose: () => void }) {
  const Icon = feature.icon
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200 rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 mx-4 sm:mx-0">

        {/* header */}
        <div className="flex items-start justify-between border-b border-border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-sans text-lg font-bold text-foreground">{feature.title}</h3>
              <p className="font-sans text-xs text-muted-foreground">Typingjon xususiyati</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* body */}
        <div className="p-6">
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            {feature.longDesc}
          </p>

          <ul className="mt-5 space-y-3">
            {feature.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </span>
                <span className="font-sans text-sm text-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* footer */}
        <div className="border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-primary py-2.5 font-sans text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
          >
            Tushundim
          </button>
        </div>
      </div>
    </div>
  )
}

export function Features() {
  const [selected, setSelected] = useState<Feature | null>(null)

  return (
    <section id="afzalliklar" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-primary">
            Afzalliklar
          </span>
          <h2 className="mt-5 font-sans text-2xl font-bold sm:text-3xl tracking-tight text-foreground sm:text-4xl">
            Tezroq yozish uchun zarur bo&apos;lgan{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              hamma narsa
            </span>
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
            Mashqni o&apos;lchanadigan natijaga aylantirish uchun yaratilgan to&apos;liq vosita to&apos;plami.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 80}>
              <GlassCard className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 sm:p-7">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/12 bg-primary/8 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/30">
                  <feature.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </div>

                <h3 className="font-sans text-[15px] font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-slate-500">
                  {feature.desc}
                </p>

                <button
                  onClick={() => setSelected(feature)}
                  className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 transition-all duration-200 group-hover:opacity-100 hover:gap-2.5"
                >
                  Ko&apos;proq bilish
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>

      {selected && (
        <FeatureModal feature={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}


