import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'

const MAX_ATTEMPTS = 5

// Mobile/unstable connections occasionally drop the HTTP request to Neon
// outright (TypeError: fetch failed) or cut off the response mid-stream
// (TypeError: terminated). Buffer the body inside the retry loop so both
// failure modes get retried with a short backoff before giving up.
neonConfig.fetchFunction = async (input: RequestInfo | URL, init?: RequestInit) => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(input, init)
      const body = await res.arrayBuffer()
      return new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers })
    } catch (err) {
      if (attempt === MAX_ATTEMPTS) throw err
      // exponential-ish backoff: 250, 500, 1000, 2000 ms
      await new Promise(resolve => setTimeout(resolve, 250 * 2 ** (attempt - 1)))
    }
  }
  throw new Error('unreachable')
}

let client: PrismaClient | undefined

export function getDb(): PrismaClient {
  if (!client) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL muhit o\'zgaruvchisi topilmadi')
    const adapter = new PrismaNeonHttp(url, {})
    client = new PrismaClient({ adapter } as any)
  }
  return client
}
