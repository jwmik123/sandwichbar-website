import { unstable_cache } from 'next/cache'

export type TikTokVideo = {
  id: string
  title?: string
  cover_image_url?: string
  share_url?: string
}

async function fetchAccessToken(): Promise<string> {
  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: process.env.TIKTOK_REFRESH_TOKEN!,
    }),
    cache: 'no-store',
  })

  const data = await res.json()
  if (!data.access_token) {
    throw new Error(`TikTok token refresh failed: ${JSON.stringify(data)}`)
  }
  return data.access_token
}

async function _fetchLatestTikToks(): Promise<TikTokVideo[]> {
  if (!process.env.TIKTOK_REFRESH_TOKEN) return []

  const accessToken = await fetchAccessToken()

  const res = await fetch(
    'https://open.tiktokapis.com/v2/video/list/?fields=id,title,cover_image_url,share_url',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ max_count: 4 }),
      cache: 'no-store',
    },
  )

  const data = await res.json()
  return data.data?.videos ?? []
}

export const getLatestTikToks = unstable_cache(_fetchLatestTikToks, ['tiktok-latest-videos'], {
  revalidate: 3600,
})
