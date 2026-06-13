import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const size        = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          borderRadius: 112,
          background: 'linear-gradient(145deg, #2563eb 0%, #4f46e5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Keyboard card */}
        <div
          style={{
            width: 380,
            height: 252,
            background: 'rgba(255,255,255,0.10)',
            border: '12px solid rgba(255,255,255,0.88)',
            borderRadius: 28,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            padding: '18px 16px',
          }}
        >
          {/* Row 1 — 5 keys */}
          <div style={{ display: 'flex', gap: 14 }}>
            {[0,1,2,3,4].map(k => (
              <div key={k} style={{ width: 50, height: 38, background: 'rgba(255,255,255,0.93)', borderRadius: 9 }} />
            ))}
          </div>
          {/* Row 2 — 4 keys */}
          <div style={{ display: 'flex', gap: 14 }}>
            {[0,1,2,3].map(k => (
              <div key={k} style={{ width: 50, height: 38, background: 'rgba(255,255,255,0.65)', borderRadius: 9 }} />
            ))}
          </div>
          {/* Spacebar */}
          <div style={{ width: 196, height: 36, background: 'rgba(255,255,255,0.38)', borderRadius: 9 }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
