'use client'

import dynamic from 'next/dynamic'

const PdfViewerContent = dynamic(
  () => import('./pdf-viewer-content').then((m) => m.PdfViewerContent),
  { ssr: false, loading: () => <div className="w-full animate-pulse rounded-2xl bg-white/50" style={{ aspectRatio: '1 / 1.41' }} /> },
)

export function CateringMenu({ url }: { url: string }) {
  return <PdfViewerContent url={url} />
}
