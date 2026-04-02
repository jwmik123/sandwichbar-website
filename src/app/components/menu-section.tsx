'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'

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
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:flex-[2] min-w-0">
          <PdfViewerContent url={data.menuPdfUrl} />
        </div>
        <div className="w-full md:flex-[1] min-w-0">
          <Image
            src="/images/drinkmenu.jpeg"
            alt="Drink menu"
            width={0}
            height={0}
            sizes="50vw"
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
