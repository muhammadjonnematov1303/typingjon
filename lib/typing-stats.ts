// ─────────────────────────────────────────────────────────────────────────────
// Unified typing-statistics pipeline — shared by Standard Test, Custom Test and
// Lessons so every mode computes WPM / Accuracy / OWR exactly the same way.
//
// Two error notions are tracked deliberately:
//   • everErrors  — a position that was EVER mistyped, even if later corrected.
//                   Drives Accuracy and the error/“incorrect” count, matching
//                   MonkeyType (and the product rule: a corrected mistake still
//                   counts against accuracy).
//   • finalErrors — a position still wrong at the very end. Excluded from speed,
//                   so fixing a typo doesn’t permanently lower your WPM.
// ─────────────────────────────────────────────────────────────────────────────

export interface StatsInput {
  /** every character the user typed (capped to the target length) */
  totalChars: number
  /** positions still wrong at the end — excluded from WPM */
  finalErrors: number
  /** positions ever mistyped — drive accuracy + error count */
  everErrors: number
  /** precise elapsed seconds */
  durationSec: number
  /** per-second instantaneous-WPM samples, for consistency */
  samples?: number[]
}

export interface TypingStats {
  wpm: number          // net speed — correctly-typed final text
  rawWpm: number       // gross speed — every keystroke counts
  accuracy: number     // 0–100, corrected mistakes count against it
  correct: number      // characters typed correctly on the first try
  incorrect: number    // characters ever mistyped
  consistency: number  // 0–100, steadiness of typing speed
  durationSec: number  // precise duration
  chars: number        // total characters typed
}

const MAX_WPM = 400
// Floor the elapsed time so an instantly-finished short passage (e.g. a 1–2
// character custom text completed in a single keystroke, where start and end
// land in the same millisecond) can never divide by zero and collapse WPM to 0.
const MIN_ELAPSED_SEC = 0.3

function safe(n: number, fallback = 0): number {
  return Number.isFinite(n) ? n : fallback
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(Math.max(n, lo), hi)
}

export function computeConsistency(samples: number[] = []): number {
  const valid = samples.filter(s => Number.isFinite(s) && s > 0)
  if (valid.length < 2) return 100
  const mean = valid.reduce((a, b) => a + b, 0) / valid.length
  if (mean <= 0) return 100
  const variance = valid.reduce((a, b) => a + (b - mean) ** 2, 0) / valid.length
  const stddev = Math.sqrt(variance)
  return clamp(Math.round(100 - (stddev / mean) * 100), 0, 100)
}

export function calculateStats(input: StatsInput): TypingStats {
  const totalChars  = Math.max(0, safe(input.totalChars))
  const finalErrors = clamp(safe(input.finalErrors), 0, totalChars)
  const everErrors  = clamp(safe(input.everErrors), 0, totalChars)
  const durationSec = Math.max(0, safe(input.durationSec))

  const minutes      = Math.max(durationSec, MIN_ELAPSED_SEC) / 60
  const correctSpeed = Math.max(totalChars - finalErrors, 0)

  const wpm    = clamp(Math.round((correctSpeed / 5) / minutes), 0, MAX_WPM)
  const rawWpm = clamp(Math.round((totalChars / 5) / minutes), 0, MAX_WPM)

  const correct   = Math.max(totalChars - everErrors, 0)
  const incorrect = everErrors
  const accuracy  = totalChars > 0 ? clamp(Math.round((correct / totalChars) * 100), 0, 100) : 0

  return {
    wpm,
    rawWpm,
    accuracy,
    correct,
    incorrect,
    consistency: computeConsistency(input.samples),
    durationSec,
    chars: totalChars,
  }
}

// ── OWR ─────────────────────────────────────────────────────────────────────
// OWR is the user's progress rating = how many lesson "steps" (qadam) they've
// completed. It is NOT derived from typing speed — it's updated when a lesson is
// finished (see /api/lessons/complete) and ranks the leaderboard.
