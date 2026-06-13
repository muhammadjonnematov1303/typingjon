export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-blue-600 to-blue-700 shadow-lg shadow-primary/40 ring-1 ring-white/10">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
          {/* Keyboard body */}
          <rect
            x="1.5" y="5.5" width="21" height="13" rx="2.5"
            stroke="white" strokeWidth="1.5"
            fill="white" fillOpacity="0.12"
          />
          {/* Row 1 — 5 keys */}
          <rect x="3.5"  y="7.5" width="2.5" height="2" rx="0.6" fill="white" fillOpacity="0.9"/>
          <rect x="7"    y="7.5" width="2.5" height="2" rx="0.6" fill="white" fillOpacity="0.9"/>
          <rect x="10.5" y="7.5" width="2.5" height="2" rx="0.6" fill="white" fillOpacity="0.9"/>
          <rect x="14"   y="7.5" width="2.5" height="2" rx="0.6" fill="white" fillOpacity="0.9"/>
          <rect x="17.5" y="7.5" width="2.5" height="2" rx="0.6" fill="white" fillOpacity="0.9"/>
          {/* Row 2 — 4 keys (offset) */}
          <rect x="4.5"  y="10.5" width="2.5" height="2" rx="0.6" fill="white" fillOpacity="0.65"/>
          <rect x="8.5"  y="10.5" width="2.5" height="2" rx="0.6" fill="white" fillOpacity="0.65"/>
          <rect x="12.5" y="10.5" width="2.5" height="2" rx="0.6" fill="white" fillOpacity="0.65"/>
          <rect x="16.5" y="10.5" width="2.5" height="2" rx="0.6" fill="white" fillOpacity="0.65"/>
          {/* Spacebar */}
          <rect x="7" y="13.5" width="10" height="2" rx="0.6" fill="white" fillOpacity="0.45"/>
        </svg>
      </div>
      <span className="font-mono text-[1.05rem] font-bold tracking-tight">
        <span className="text-foreground">Typing</span>
        <span className="text-primary">jon</span>
      </span>
    </div>
  )
}
