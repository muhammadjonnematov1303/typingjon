'use client'

type Finger = 'lp' | 'lr' | 'lm' | 'li' | 'ri' | 'rm' | 'rr' | 'rp' | 'th'

const FINGER_OF: Record<string, Finger> = {
  '`': 'lp', '1': 'lp', 'q': 'lp', 'a': 'lp', 'z': 'lp', 'tab': 'lp', 'capslock': 'lp', 'shiftleft': 'lp',
  '2': 'lr', 'w': 'lr', 's': 'lr', 'x': 'lr',
  '3': 'lm', 'e': 'lm', 'd': 'lm', 'c': 'lm',
  '4': 'li', '5': 'li', 'r': 'li', 't': 'li', 'f': 'li', 'g': 'li', 'v': 'li', 'b': 'li',
  '6': 'ri', '7': 'ri', 'y': 'ri', 'u': 'ri', 'h': 'ri', 'j': 'ri', 'n': 'ri', 'm': 'ri',
  '8': 'rm', 'i': 'rm', 'k': 'rm', ',': 'rm',
  '9': 'rr', 'o': 'rr', 'l': 'rr', '.': 'rr',
  '0': 'rp', '-': 'rp', '=': 'rp', 'p': 'rp', '[': 'rp', ']': 'rp', '\\': 'rp', ';': 'rp', "'": 'rp', '/': 'rp',
  'backspace': 'rp', 'enter': 'rp', 'shiftright': 'rp',
  ' ': 'th', 'space': 'th',
}

type KeyType = 'letter' | 'mod' | 'accent' | 'brand'
type Align = 'l' | 'c' | 'r'

interface KeyDef {
  id: string
  label: string
  w?: number
  shift?: string
  gapBefore?: number
  type?: KeyType
  align?: Align
  icon?: 'kbd' | 'menu'
}

// Full ANSI layout with a function row and a bottom modifier row — every row spans 15 units
const ROWS: KeyDef[][] = [
  [
    { id: 'kbd-icon', label: '', w: 1.5, type: 'accent', icon: 'kbd' },
    { id: 'f1', label: 'F1', w: 0.88, type: 'mod', gapBefore: 0.15 },
    { id: 'f2', label: 'F2', w: 0.88, type: 'mod' },
    { id: 'f3', label: 'F3', w: 0.88, type: 'mod' },
    { id: 'f4', label: 'F4', w: 0.88, type: 'mod' },
    { id: 'f5', label: 'F5', w: 0.88, type: 'mod', gapBefore: 0.35 },
    { id: 'f6', label: 'F6', w: 0.88, type: 'mod' },
    { id: 'f7', label: 'F7', w: 0.88, type: 'mod' },
    { id: 'f8', label: 'F8', w: 0.88, type: 'mod' },
    { id: 'f9', label: 'F9', w: 0.88, type: 'mod', gapBefore: 0.35 },
    { id: 'f10', label: 'F10', w: 0.88, type: 'mod' },
    { id: 'f11', label: 'F11', w: 0.88, type: 'mod' },
    { id: 'f12', label: 'F12', w: 0.88, type: 'mod' },
    { id: 'brand', label: 'Typingjon', w: 2.1, type: 'brand' },
  ],
  [
    { id: '`', label: '`', shift: '~' }, { id: '1', label: '1', shift: '!' }, { id: '2', label: '2', shift: '@' },
    { id: '3', label: '3', shift: '#' }, { id: '4', label: '4', shift: '$' }, { id: '5', label: '5', shift: '%' },
    { id: '6', label: '6', shift: '^' }, { id: '7', label: '7', shift: '&' }, { id: '8', label: '8', shift: '*' },
    { id: '9', label: '9', shift: '(' }, { id: '0', label: '0', shift: ')' }, { id: '-', label: '-', shift: '_' },
    { id: '=', label: '=', shift: '+' }, { id: 'backspace', label: 'Backspace', w: 2, type: 'mod', align: 'r' },
  ],
  [
    { id: 'tab', label: 'Tab', w: 1.5, type: 'mod', align: 'l' },
    { id: 'q', label: 'q' }, { id: 'w', label: 'w' }, { id: 'e', label: 'e' }, { id: 'r', label: 'r' },
    { id: 't', label: 't' }, { id: 'y', label: 'y' }, { id: 'u', label: 'u' }, { id: 'i', label: 'i' },
    { id: 'o', label: 'o' }, { id: 'p', label: 'p' },
    { id: '[', label: '[', shift: '{' }, { id: ']', label: ']', shift: '}' }, { id: '\\', label: '\\', shift: '|', w: 1.5 },
  ],
  [
    { id: 'capslock', label: 'Caps Lock', w: 1.75, type: 'mod', align: 'l' },
    { id: 'a', label: 'a' }, { id: 's', label: 's' }, { id: 'd', label: 'd' }, { id: 'f', label: 'f' },
    { id: 'g', label: 'g' }, { id: 'h', label: 'h' }, { id: 'j', label: 'j' }, { id: 'k', label: 'k' }, { id: 'l', label: 'l' },
    { id: ';', label: ';', shift: ':' }, { id: "'", label: "'", shift: '"' },
    { id: 'enter', label: 'Enter', w: 2.25, type: 'accent' },
  ],
  [
    { id: 'shiftleft', label: 'Shift', w: 2.25, type: 'mod', align: 'l' },
    { id: 'z', label: 'z' }, { id: 'x', label: 'x' }, { id: 'c', label: 'c' }, { id: 'v', label: 'v' },
    { id: 'b', label: 'b' }, { id: 'n', label: 'n' }, { id: 'm', label: 'm' },
    { id: ',', label: ',', shift: '<' }, { id: '.', label: '.', shift: '>' }, { id: '/', label: '/', shift: '?' },
    { id: 'shiftright', label: 'Shift', w: 2.75, type: 'mod' },
  ],
  [
    { id: 'ctrlleft', label: 'Ctrl', w: 1.4, type: 'mod' },
    { id: 'win', label: 'Win', w: 1.4, type: 'mod' },
    { id: 'altleft', label: 'Alt', w: 1.4, type: 'mod' },
    { id: 'space', label: '', w: 5.2 },
    { id: 'altright', label: 'Alt', w: 1.4, type: 'mod' },
    { id: 'fn', label: 'Fn', w: 1.4, type: 'mod' },
    { id: 'menu', label: '', w: 1.4, type: 'mod', icon: 'menu' },
    { id: 'ctrlright', label: 'Ctrl', w: 1.4, type: 'mod' },
  ],
]

// ── Geometry ──
const U    = 92   // key unit (full cell)
const GAP  = 11   // spacing between keycaps
const SEP  = 18   // extra gap below the function row

const ROW_Y: number[] = ROWS.map((_, ri) => ri * U + (ri >= 1 ? SEP : 0))

interface PositionedKey extends KeyDef { x: number; y: number; rw: number; rh: number }

const KEY_LAYOUT: PositionedKey[][] = ROWS.map((row, ri) => {
  let cursor = 0
  const y = ROW_Y[ri]
  return row.map((key) => {
    cursor += (key.gapBefore ?? 0) * U
    const cell = (key.w ?? 1) * U
    const positioned: PositionedKey = { ...key, x: cursor, y, rw: cell - GAP, rh: U - GAP }
    cursor += cell
    return positioned
  })
})

const RENDER_KEYS = KEY_LAYOUT.flat()

// Reverse lookup: a shifted symbol (e.g. "!") → the physical key that types it (e.g. "1")
const SHIFT_TO_BASE = new Map<string, string>()
for (const k of RENDER_KEYS) if (k.shift) SHIFT_TO_BASE.set(k.shift, k.id)

const BOARD_W = Math.max(...KEY_LAYOUT.map(row => { const k = row[row.length - 1]; return k.x + k.rw }))
const BOARD_H = ROW_Y[ROW_Y.length - 1] + (U - GAP)

const PAD    = 34   // case padding around the keys
const VIEW_W = BOARD_W + PAD * 2
const VIEW_H = BOARD_H + PAD * 2

const ACCENT = '#2563eb'

// Per-type keycap palette
interface CapStyle { grad: string; skirt: string; stroke: string; label: string; sheen: number }
function capStyle(type: KeyType, isActive: boolean): CapStyle {
  if (isActive) return { grad: 'url(#kbBlue)', skirt: '#1d4ed8', stroke: '#2563eb', label: '#ffffff', sheen: 0.22 }
  switch (type) {
    case 'accent': return { grad: 'url(#kbBlue)',  skirt: '#1d4ed8', stroke: '#2f6ae0', label: '#ffffff', sheen: 0.22 }
    case 'mod':    return { grad: 'url(#kbGray)',  skirt: '#c2c9d3', stroke: '#d2d8e1', label: '#475569', sheen: 0.5 }
    default:       return { grad: 'url(#kbWhite)', skirt: '#cfd5de', stroke: '#e4e8ee', label: '#3f4756', sheen: 0.55 }
  }
}

function KbdGlyph({ cx, cy }: { cx: number; cy: number }) {
  // tiny keyboard icon, centred in the blue accent key
  const w = 30, h = 21
  const x = cx - w / 2, y = cy - h / 2
  const keys: Array<[number, number, number]> = [
    [4, 4, 0.95], [9, 4, 0.95], [14, 4, 0.95], [19, 4, 0.95], [24, 4, 0.95],
    [6, 9, 0.7], [11, 9, 0.7], [16, 9, 0.7], [21, 9, 0.7],
  ]
  return (
    <g className="pointer-events-none">
      <rect x={x} y={y} width={w} height={h} rx={3} fill="white" fillOpacity={0.14} stroke="white" strokeWidth={1.4} />
      {keys.map(([kx, ky, op], i) => (
        <rect key={i} x={x + kx} y={y + ky} width={3.4} height={2.6} rx={0.7} fill="white" fillOpacity={op} />
      ))}
      <rect x={x + 9} y={y + 14} width={12} height={2.6} rx={0.7} fill="white" fillOpacity={0.5} />
    </g>
  )
}

function KeyContent({ k, style }: { k: PositionedKey; style: CapStyle }) {
  const cx = k.x + k.rw / 2
  const cy = k.y + k.rh / 2

  if (k.icon === 'kbd') return <KbdGlyph cx={cx} cy={cy} />

  if (k.icon === 'menu') {
    const lw = 16, x = cx - lw / 2
    return (
      <g className="pointer-events-none">
        {[-5, -1, 3, 7].map((dy, i) => (
          <rect key={i} x={x} y={cy + dy} width={lw} height={1.8} rx={0.9} fill={style.label} opacity={0.85} />
        ))}
      </g>
    )
  }

  if (k.id === 'brand') {
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
        className="pointer-events-none font-sans" fontSize={20} fontWeight={800} letterSpacing="-0.5">
        <tspan fill="#1e293b">Typing</tspan><tspan fill={ACCENT}>jon</tspan>
      </text>
    )
  }

  // Dual-symbol keys (numbers + punctuation): shift glyph on top, base below — both centred
  if (k.shift) {
    return (
      <g className="pointer-events-none font-sans">
        <text x={cx} y={k.y + k.rh * 0.34} textAnchor="middle" dominantBaseline="central"
          fontSize={18} fontWeight={600} fill={style.label} opacity={0.78} style={{ transition: 'fill 200ms ease' }}>
          {k.shift}
        </text>
        <text x={cx} y={k.y + k.rh * 0.68} textAnchor="middle" dominantBaseline="central"
          fontSize={20} fontWeight={600} fill={style.label} style={{ transition: 'fill 200ms ease' }}>
          {k.label}
        </text>
      </g>
    )
  }

  // Word labels (Tab, Caps Lock, Shift, Enter, Ctrl…) — alignable
  const isWord = k.label.length > 1
  const align  = k.align ?? 'c'
  const tx = align === 'l' ? k.x + 16 : align === 'r' ? k.x + k.rw - 16 : cx
  const anchor = align === 'l' ? 'start' : align === 'r' ? 'end' : 'middle'
  const display = isWord ? k.label : k.label.toUpperCase()

  return (
    <text x={tx} y={cy} textAnchor={anchor} dominantBaseline="central"
      className="pointer-events-none font-sans"
      fontSize={isWord ? 15 : 26} fontWeight={isWord ? 600 : 600}
      fill={style.label} style={{ transition: 'fill 200ms ease' }}>
      {display}
    </text>
  )
}

export function KeyboardGuide({ nextChar }: { nextChar: string | null }) {
  const lookupKey  = nextChar == null ? null : nextChar === ' ' ? 'space' : nextChar.toLowerCase()
  const isUpper    = nextChar != null && /[a-z]/i.test(nextChar) && nextChar !== nextChar.toLowerCase()
  const isSymbol   = lookupKey != null && SHIFT_TO_BASE.has(lookupKey)
  const effectiveKey = isSymbol ? SHIFT_TO_BASE.get(lookupKey!)! : lookupKey
  const finger     = effectiveKey ? FINGER_OF[effectiveKey] ?? null : null
  const needsShift = isUpper || isSymbol
  const shiftKeyId = needsShift && finger ? (finger.startsWith('l') ? 'shiftright' : finger.startsWith('r') ? 'shiftleft' : null) : null

  return (
    <div className="hidden w-full max-w-5xl rounded-[1.75rem] bg-gradient-to-br from-blue-100/70 via-white to-indigo-100/60 p-[1px] shadow-[0_12px_40px_-16px_rgba(15,23,42,0.18)] dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/40 md:block">
      <div className="rounded-[calc(1.75rem-1px)] bg-white/80 px-4 py-4 backdrop-blur-xl dark:bg-slate-900/80 sm:px-6 sm:py-5">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full" role="img" aria-label="Klaviatura ko'rsatkichi">
          <defs>
            <linearGradient id="kbWhite" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#eef1f6" />
            </linearGradient>
            <linearGradient id="kbGray" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f5f7fa" /><stop offset="1" stopColor="#dde2ea" />
            </linearGradient>
            <linearGradient id="kbBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4f8bf7" /><stop offset="1" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="kbCase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fdfdff" /><stop offset="1" stopColor="#e8ebf2" />
            </linearGradient>
          </defs>

          {/* ── Case ── */}
          <rect x={1} y={2} width={VIEW_W - 2} height={VIEW_H - 2} rx={30} fill="#d6dbe4" opacity={0.6} />
          <rect x={0} y={0} width={VIEW_W} height={VIEW_H - 3} rx={30} fill="url(#kbCase)"
            stroke="#ffffff" strokeWidth={1.5} />
          <rect x={PAD - 12} y={PAD - 12} width={BOARD_W + 24} height={BOARD_H + 24} rx={18}
            fill="#eef1f6" stroke="#dfe3ea" strokeWidth={1} />

          {/* ── Keys ── */}
          <g transform={`translate(${PAD}, ${PAD})`}>
            {RENDER_KEYS.map((key) => {
              const isActive = effectiveKey === key.id || shiftKeyId === key.id
              const isHome   = key.id === 'f' || key.id === 'j'
              const style    = capStyle(key.type ?? 'letter', isActive)
              const cx = key.x + key.rw / 2
              const cy = key.y + key.rh / 2
              return (
                <g key={key.id} className={isActive ? 'tj-key-glow' : 'tj-keycap'}>
                  {isActive && (
                    <>
                      <rect x={key.x - 6} y={key.y - 6} width={key.rw + 12} height={key.rh + 12} rx={16}
                        fill={ACCENT} opacity={0.16} className="tj-halo-pulse" />
                      <circle cx={cx} cy={cy} r={Math.min(key.rw, key.rh) / 2}
                        fill="none" stroke={ACCENT} strokeWidth={2.5} className="tj-finger-ring" />
                    </>
                  )}

                  {/* keycap shadow + skirt + raised face */}
                  <rect x={key.x} y={key.y + 4} width={key.rw} height={key.rh} rx={12}
                    fill="#1e293b" opacity={0.08} />
                  <rect x={key.x} y={key.y} width={key.rw} height={key.rh} rx={12}
                    fill={style.skirt} style={{ transition: 'fill 200ms ease' }} />
                  <rect x={key.x + 1.5} y={key.y} width={key.rw - 3} height={key.rh - 5} rx={10}
                    fill={style.grad} stroke={style.stroke} strokeWidth={1}
                    style={{ transition: 'stroke 200ms ease' }} />
                  {/* top sheen */}
                  <rect x={key.x + 5} y={key.y + 3} width={key.rw - 10} height={(key.rh - 5) * 0.42} rx={8}
                    fill="#ffffff" opacity={style.sheen} />

                  <KeyContent k={key} style={style} />

                  {isHome && (
                    <rect x={cx - 9} y={key.y + key.rh - 13} width={18} height={3} rx={1.5}
                      fill={isActive ? '#ffffff' : style.label} opacity={isActive ? 0.85 : 0.45} />
                  )}
                </g>
              )
            })}
          </g>
        </svg>
      </div>
    </div>
  )
}
