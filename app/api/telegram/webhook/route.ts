import { NextRequest, NextResponse } from 'next/server'
import { tgSend, tgAnswerCbq, ADMIN_ID } from '@/lib/telegram'
import { getDb } from '@/lib/prisma'

// Stateless category detection: bot sends force_reply messages with these exact prompts.
// When user replies, we detect category from the replied-to message text.
const PROMPT_TO_CATEGORY: Record<string, string> = {
  "Muammoingizni tasvirlab yozing:": "Muammo",
  "Taklifingizni yozing:":           "Taklif",
  "Savolingizni yozing:":            "Savol",
  "Xabaringizni yozing:":            "Boshqa",
}

const START_KEYBOARD = {
  inline_keyboard: [
    [
      { text: "Yangi foydalanuvchi",  url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://typingjon.uz'}/register` },
      { text: "Hisobga kirish",       url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://typingjon.uz'}/login`    },
    ],
    [
      { text: "Muammo bildirish",  callback_data: "cat:muammo" },
      { text: "Taklif yuborish",   callback_data: "cat:taklif" },
    ],
    [
      { text: "Savol berish",      callback_data: "cat:savol"  },
      { text: "Saytga o'tish",     url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://typingjon.uz'}/dashboard`   },
    ],
  ],
}

const CATEGORY_PROMPTS: Record<string, string> = {
  muammo: "Muammoingizni tasvirlab yozing:",
  taklif: "Taklifingizni yozing:",
  savol:  "Savolingizni yozing:",
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json()

    // ── Callback query (button press) ──────────────────────────────────────────
    if (update.callback_query) {
      const cbq  = update.callback_query
      const data = cbq.data as string
      const from = cbq.from

      await tgAnswerCbq(cbq.id)

      if (data.startsWith('cat:')) {
        const cat    = data.slice(4)
        const prompt = CATEGORY_PROMPTS[cat] ?? "Xabaringizni yozing:"
        await tgSend(from.id, prompt, { reply_markup: { force_reply: true, selective: true } })
      }

      return NextResponse.json({ ok: true })
    }

    // ── Message ─────────────────────────────────────────────────────────────────
    if (update.message) {
      const msg    = update.message
      const from   = msg.from
      const text   = msg.text as string | undefined
      const chatId = msg.chat.id as number

      if (!text) return NextResponse.json({ ok: true })

      const firstName = from.first_name ?? ''
      const userName  = from.username ? `@${from.username}` : firstName

      // /start command
      if (text === '/start') {
        const welcome = [
          `Assalomu aleykum, <b>${firstName}</b>!`,
          '',
          "Typingjon qo'llab-quvvatlash botiga xush kelibsiz.",
          "Murojaatlaringiz uchun doimo shu yerdamiz.",
          '',
          "Kerakli bo'limni tanlang:",
        ].join('\n')

        await tgSend(chatId, welcome, { reply_markup: START_KEYBOARD })
        return NextResponse.json({ ok: true })
      }

      // /xabar {userId} {message} — admin sends in-app notification to user
      if (text.startsWith('/xabar ') && String(chatId) === String(ADMIN_ID)) {
        const parts   = text.slice(7).split(' ')
        const userId  = parts[0]
        const notifText = parts.slice(1).join(' ')

        if (!userId || !notifText) {
          await tgSend(chatId, "Format: /xabar {userId} {xabar matni}")
          return NextResponse.json({ ok: true })
        }

        const db = getDb()
        const user = await db.user.findUnique({ where: { id: userId } })

        if (!user) {
          await tgSend(chatId, `Foydalanuvchi topilmadi: ${userId}`)
          return NextResponse.json({ ok: true })
        }

        await db.notification.create({
          data: {
            userId,
            title: "Sizga javob keldi",
            body:  notifText,
          },
        })

        await tgSend(chatId, `Bildirishnoma yuborildi: <b>${user.name}</b>\n\n${notifText}`)
        return NextResponse.json({ ok: true })
      }

      // Skip messages from admin (don't forward to themselves)
      if (String(chatId) === String(ADMIN_ID)) {
        return NextResponse.json({ ok: true })
      }

      // Detect category from force_reply context (stateless: read replied message text)
      let category = 'Murojaat'
      if (msg.reply_to_message?.text) {
        category = PROMPT_TO_CATEGORY[msg.reply_to_message.text] ?? 'Murojaat'
      }

      // Forward to admin
      const fwd = [
        `<b>Yangi murojaat — ${category}</b>`,
        '',
        `<b>Kim:</b> ${userName}`,
        `<b>Chat ID:</b> <code>${chatId}</code>`,
        '',
        '<b>Xabar:</b>',
        text,
        '',
        `<i>Telegram orqali javob: /xabar_tg ${chatId} &lt;matn&gt;</i>`,
      ].join('\n')

      await tgSend(ADMIN_ID, fwd)

      // Confirm to user
      await tgSend(chatId, "Xabaringiz qabul qilindi. Tez orada javob beramiz!")

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ ok: false }, { status: 200 }) // always 200 to Telegram
  }
}
