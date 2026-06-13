const TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const BASE  = `https://api.telegram.org/bot${TOKEN}`

type Extra = Record<string, unknown>

export const ADMIN_ID = process.env.TELEGRAM_CHAT_ID!

export async function tgSend(chatId: number | string, text: string, extra: Extra = {}) {
  const res = await fetch(`${BASE}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...extra }),
  })
  return res.json()
}

export async function tgAnswerCbq(id: string, text = '') {
  return fetch(`${BASE}/answerCallbackQuery`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ callback_query_id: id, text }),
  })
}

export async function tgSetWebhook(url: string) {
  const res = await fetch(`${BASE}/setWebhook`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ url, drop_pending_updates: true }),
  })
  return res.json()
}
