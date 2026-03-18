'use client'

import { useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`

export function PdfViewerContent({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    const containerWidth = container.clientWidth

    async function render() {
      const pdf = await pdfjsLib.getDocument(url).promise
      if (cancelled) return

      for (let i = 1; i <= pdf.numPages; i++) {
        if (cancelled) return
        const page = await pdf.getPage(i)
        if (cancelled) return

        const baseViewport = page.getViewport({ scale: 1 })
        const scale = (containerWidth / baseViewport.width) * (window.devicePixelRatio || 1)
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        canvas.style.width = '100%'
        canvas.style.display = 'block'

        container!.appendChild(canvas)

        await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
      }
    }

    render()

    return () => {
      cancelled = true
      while (container.firstChild) container.removeChild(container.firstChild)
    }
  }, [url])

  return <div ref={containerRef} className="w-full rounded-2xl overflow-hidden shadow-lg" />
}
