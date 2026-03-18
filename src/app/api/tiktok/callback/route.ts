import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const error = req.nextUrl.searchParams.get('error')

  if (error) {
    return new NextResponse(
      `<html><body><h2>TikTok OAuth Error</h2><pre>${error}: ${req.nextUrl.searchParams.get('error_description')}</pre></body></html>`,
      { headers: { 'Content-Type': 'text/html' } },
    )
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  const proto = req.headers.get('x-forwarded-proto') ?? 'http'
  const host = req.headers.get('host')
  const redirectUri = `${proto}://${host}/api/tiktok/callback`

  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
    cache: 'no-store',
  })

  const data = await res.json()

  if (!data.refresh_token) {
    return new NextResponse(
      `<html><body><h2>Token exchange failed</h2><pre>${JSON.stringify(data, null, 2)}</pre></body></html>`,
      { headers: { 'Content-Type': 'text/html' } },
    )
  }

  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head><style>
  body { font-family: monospace; max-width: 700px; margin: 40px auto; padding: 0 20px; }
  pre { background: #f4f4f4; padding: 16px; border-radius: 8px; word-break: break-all; white-space: pre-wrap; }
  h2 { color: #2e7d32; }
</style></head>
<body>
  <h2>✓ TikTok OAuth successful</h2>
  <p>Add the following to your <code>.env.local</code>:</p>
  <pre>TIKTOK_REFRESH_TOKEN=${data.refresh_token}</pre>
  <p style="color:#888; font-size:0.85em">
    Access token (expires in ${data.expires_in}s — not needed in .env):<br/>
    ${data.access_token}
  </p>
  <p>Restart your dev server after updating <code>.env.local</code>.</p>
</body>
</html>`,
    { headers: { 'Content-Type': 'text/html' } },
  )
}
