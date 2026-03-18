'use client'

import dynamic from 'next/dynamic'

const PdfViewerContent = dynamic(
  () => import('./pdf-viewer-content').then((m) => m.PdfViewerContent),
  { ssr: false, loading: () => <div className="w-full animate-pulse rounded-2xl bg-white/50" style={{ aspectRatio: '1 / 1.41' }} /> },
)

type MenuData = {
  _id: string
  _type: string
  menuPdfUrl?: string | null
}

export function MenuSection({ data }: { data: MenuData | null }) {
  if (!data?.menuPdfUrl) return null

  return (
    <section id="menu" className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <PdfViewerContent url={data.menuPdfUrl} />
      </div>
    </section>
  )
}
