import { NextRequest, NextResponse } from 'next/server'

export function GET(req: NextRequest) {
  const proto = req.headers.get('x-forwarded-proto') ?? 'http'
  const host = req.headers.get('host')
  const redirectUri = `${proto}://${host}/api/tiktok/callback`

  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY!,
    scope: 'user.info.basic,video.list',
    response_type: 'code',
    redirect_uri: redirectUri,
    state: 'tiktok-setup',
  })

  return NextResponse.redirect(
    `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`,
  )
}
