import { ImageResponse } from 'next/og'

// ------------------------------------------------------------------
// Dynamic share card for LinkedIn. Size: 1200x630 (OG standard).
// Usage: /api/og?brand=Acme&category=CRMs&score=61&chatgpt=33&perplexity=50
// NOTE: satori requires every multi-child <div> to have display:flex.
// ------------------------------------------------------------------

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const brand = (searchParams.get('brand') || 'Your brand').slice(0, 40)
  const category = (searchParams.get('category') || '').slice(0, 40)
  const score = Math.min(100, Math.max(0, parseInt(searchParams.get('score') || '0', 10) || 0))
  const chatgpt = searchParams.get('chatgpt') || ''
  const perplexity = searchParams.get('perplexity') || ''

  const scoreColor = score >= 60 ? '#34d399' : score >= 30 ? '#60a5fa' : '#f87171'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 60%, #1e1b4b 100%)',
          padding: 64,
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            G
          </div>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#94a3b8' }}>
            GEOscore Delta
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', fontSize: 44, color: '#94a3b8' }}>
            {category ? `AI visibility for ${brand} (${category})` : `AI visibility for ${brand}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
            <div style={{ display: 'flex', fontSize: 180, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
              {score}
            </div>
            <div style={{ display: 'flex', fontSize: 60, color: '#475569', paddingBottom: 16 }}>/100</div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {chatgpt ? (
              <div
                style={{
                  display: 'flex',
                  padding: '16px 32px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 30,
                  color: '#e2e8f0',
                }}
              >
                ChatGPT mentions: {chatgpt}%
              </div>
            ) : null}
            {perplexity ? (
              <div
                style={{
                  display: 'flex',
                  padding: '16px 32px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 30,
                  color: '#e2e8f0',
                }}
              >
                Perplexity: {perplexity}%
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 34, color: '#64748b' }}>
          Do the AI engines recommend you? Scan your brand free — geoscore-delta.vercel.app/scan
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

