import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const size        = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: 'linear-gradient(145deg, #2563eb 0%, #4f46e5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 136,
            height: 90,
            background: 'rgba(255,255,255,0.10)',
            border: '5px solid rgba(255,255,255,0.88)',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '6px 5px',
          }}
        >
          <div style={{ display: 'flex', gap: 4 }}>
            {[0,1,2,3,4].map(k => (
              <div key={k} style={{ width: 17, height: 13, background: 'rgba(255,255,255,0.93)', borderRadius: 3 }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0,1,2,3].map(k => (
              <div key={k} style={{ width: 17, height: 13, background: 'rgba(255,255,255,0.65)', borderRadius: 3 }} />
            ))}
          </div>
          <div style={{ width: 70, height: 12, background: 'rgba(255,255,255,0.38)', borderRadius: 3 }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
