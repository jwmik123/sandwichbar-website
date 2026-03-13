'use client'

import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'

export function ImageSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      // progress: -1 (section above viewport) to 1 (section below viewport)
      const progress = (viewportHeight / 2 - (rect.top + rect.height / 2)) / viewportHeight
      setOffset(progress * 80) // 80px total travel range
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full h-[80vh] overflow-hidden flex items-center justify-center">
      <Image
        src="/images/The Sandwichbar 03.webp"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 h-[65%] aspect-[3/4] overflow-hidden shadow-2xl">
        <div
          style={{ transform: `translateY(${offset}px)`, willChange: 'transform' }}
          className="absolute inset-[-10%] transition-none"
        >
          <Image
            src="/images/The Sandwichbar 06.webp"
            alt="The Sandwich Bar"
            fill
            className="object-cover"
            sizes="33vw"
          />
        </div>
      </div>
    </section>
  )
}
