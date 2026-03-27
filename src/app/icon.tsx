import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  const imageData = readFileSync(join(process.cwd(), 'public/images/logo.jpeg'))
  const base64 = `data:image/jpeg;base64,${imageData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <img src={base64} style={{ width: 32, height: 32, objectFit: 'cover' }} />
      </div>
    ),
    { ...size }
  )
}
