'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { createDataAttribute } from 'next-sanity'
import { TransitionLink } from './transition-link'

type HeroData = {
  _id: string
  _type: string
  title?: string | null
  subtitle?: string | null
  buttonText?: string | null
  buttonLink?: string | null
}

export function HeroSection({ data }: { data: HeroData | null }) {
  const ref = useRef<HTMLElement>(null)

  if (!data) return null

  const attr = createDataAttribute({
    id: data._id,
    type: data._type,
  })

  return (
    <section
      ref={ref}
      className="hero-clip relative h-[130vh] w-full overflow-hidden"
    >
      {/* Background image */}
      <Image
        src="/images/The Sandwichbar 04.webp"
        alt="The Sandwich Bar"
        fill
        priority
        className="object-cover object-[center_65%]"
        sizes="100vw"
      />

      {/* Subtle dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Title — centered */}
      <div className="absolute top-[38%] left-[50%] z-[20] flex items-center justify-center px-6 -translate-x-1/2 -translate-y-1/2">
        <h1
          className="text-center text-7xl uppercase font-bold tracking-tighter text-cream blur-[1px] md:text-9xl leading-none"
          data-sanity={attr.scope('title').toString()}
        >
          {data.title}
        </h1>
      </div>

      {/* Subtitle + button — bottom right */}
      <div className="absolute rounded-xl p-10 bottom-[35vh] right-10 z-[20] flex flex-col items-end gap-4 text-right">
        {data.subtitle && (
          <p
            className="max-w-xs text-sm text-cream md:text-base"
            data-sanity={attr.scope('subtitle').toString()}
          >
            {data.subtitle}
          </p>
        )}
        {data.buttonText && (
          <TransitionLink
            href={data.buttonLink || '/menu'}
            className="btn-bubble-arrow"
            data-sanity={attr.scope('buttonText').toString()}
          >
            <div className="btn-bubble-arrow__arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" className="btn-bubble-arrow__arrow-svg">
                <polyline points="18 8 18 18 8 18" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.5" />
                <line x1="18" y1="18" x2="5" y2="5" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="btn-bubble-arrow__content">
              <span className="btn-bubble-arrow__content-text">{data.buttonText}</span>
            </div>
            <div className="btn-bubble-arrow__arrow is--duplicate stroke-plum">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" className="btn-bubble-arrow__arrow-svg">
                <polyline points="18 8 18 18 8 18" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.5" />
                <line x1="18" y1="18" x2="5" y2="5" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.5" />
              </svg>
            </div>
          </TransitionLink>
        )}
      </div>
    </section>
  )
}
