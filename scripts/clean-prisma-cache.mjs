import { existsSync, readdirSync, rmSync } from 'fs'
import { join } from 'path'

// pnpm keeps its own nested copy of `.prisma/client` inside @prisma/client's
// store directory. Node resolves `.prisma/client/default` from there first,
// so a stale copy (e.g. restored from a build cache) shadows the freshly
// generated one at the project root and serves an outdated schema/DMMF.
const pnpmDir = join('node_modules', '.pnpm')

if (existsSync(pnpmDir)) {
  for (const name of readdirSync(pnpmDir)) {
    if (!name.startsWith('@prisma+client@')) continue
    const stale = join(pnpmDir, name, 'node_modules', '.prisma')
    if (existsSync(stale)) {
      rmSync(stale, { recursive: true, force: true })
      console.log(`Removed stale Prisma client cache: ${stale}`)
    }
  }
}

// `prisma generate` embeds a content hash in the generated client's internal
// module name (e.g. `@prisma/client-<hash>`). Vercel restores `.next/cache`
// between builds, but its compiled chunks reference the PREVIOUS build's
// hash — once `prisma generate` re-runs and produces a new hash, those
// cached chunks point at a module that no longer exists and the build fails
// with "Cannot find module '@prisma/client-runtime-utils'". Drop the stale
// Next.js build cache so every build compiles fresh against the current
// generated client.
const nextCacheDir = join('.next', 'cache')
if (existsSync(nextCacheDir)) {
  rmSync(nextCacheDir, { recursive: true, force: true })
  console.log(`Removed stale Next.js build cache: ${nextCacheDir}`)
}
