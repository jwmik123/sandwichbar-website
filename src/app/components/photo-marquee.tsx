'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useTranslations } from 'next-intl'
import { LOCATIESHOOT_IMAGES } from './locatieshoot-images'

// Pixels per second the strip travels — slow enough to read, fast enough to notice.
const SPEED = 45

export function PhotoMarquee() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('photoMarquee')

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track) return

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      let tween: gsap.core.Tween | undefined

      const start = () => {
        tween?.kill()
        gsap.set(track, { x: 0 })

        // The track holds two identical halves, so travelling one half loops seamlessly.
        const half = track.scrollWidth / 2
        if (!half) return

        tween = gsap.to(track, {
          x: -half,
          duration: half / SPEED,
          ease: 'none',
          repeat: -1,
        })
      }

      start()

      let resizeTimer: ReturnType<typeof setTimeout>
      const handleResize = () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(start, 200)
      }

      window.addEventListener('resize', handleResize)

      return () => {
        clearTimeout(resizeTimer)
        window.removeEventListener('resize', handleResize)
        tween?.kill()
      }
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="bg-cream py-16 md:py-24 overflow-hidden">
      <p className="mb-8 md:mb-12 px-6 text-center text-sm font-semibold uppercase tracking-widest text-plum/50">
        {t('label')}
      </p>

      <div ref={trackRef} className="flex w-max will-change-transform">
        {[...LOCATIESHOOT_IMAGES, ...LOCATIESHOOT_IMAGES].map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative mr-4 md:mr-6 h-64 md:h-96 aspect-[2/3] flex-none"
          >
            <Image
              src={src}
              alt=""
              fill
              // The strip never stops, so a lazily loaded card arrives after it has
              // already scrolled past — every photo is fetched up front instead.
              loading="eager"
              className="object-cover"
              // Card width is exactly two thirds of its height: h-64 → 171px, h-96 → 256px.
              sizes="(max-width: 768px) 171px, 256px"
              quality={50}
              draggable={false}
              aria-hidden={i >= LOCATIESHOOT_IMAGES.length}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
