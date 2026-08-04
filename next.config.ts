import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    // 512 lets the photo marquee's 256px cards hit an exact 2x candidate
    // instead of jumping to the next default width (640).
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    // 50 is for decorative strips where the cards are small and always moving.
    qualities: [50, 75],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'accelerometer=*, gyroscope=*, magnetometer=*',
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
