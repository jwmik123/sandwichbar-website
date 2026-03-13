'use client'

import { useRef, useEffect, useMemo } from 'react'
import { createDataAttribute } from 'next-sanity'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type SloganData = {
  _id: string
  _type: string
  text?: string | null
}

const BG_PATH = 'M-71 371.6C126.3 260 593.5 65.8 934.5 80.8c313 13.8 497 136 572 200'
const TEXT_PATH = 'M-71 371.6C126.3 260 593.5 65.8 934.5 80.8c313 13.8 497 136 572 200'
const REPETITIONS = 4
const SEPARATOR = ' \u00B7 '

export function SloganSection({ data }: { data: SloganData | null }) {
  const sectionRef = useRef<HTMLElement>(null)
  const textPathRef = useRef<SVGTextPathElement>(null)

  const repeatedText = useMemo(() => {
    if (!data?.text) return ''
    const base = data.text.toUpperCase()
    return Array(REPETITIONS).fill(base).join(SEPARATOR) + SEPARATOR
  }, [data?.text])

  useEffect(() => {
    const section = sectionRef.current
    const textPath = textPathRef.current
    if (!section || !textPath) return

    gsap.set(textPath, { attr: { startOffset: '-50%' } })

    const tween = gsap.to(textPath, {
      attr: { startOffset: '0%' },
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [repeatedText])

  if (!data) return null

  const attr = createDataAttribute({
    id: data._id,
    type: data._type,
  })

  return (
    <section
      ref={sectionRef}
      className="relative z-10 -mt-[22.95vw] md:-mt-[16.95vw] overflow-hidden"
      data-sanity={attr.scope('text').toString()}
    >
      <div className="relative w-full">
        {/* Background band SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 1440 442"
          width="100%"
          className="block text-plum"
          style={{ overflow: 'visible' }}
        >
          {/* Cream fill below the band — hides the hero photo underneath */}
          <path
            className="fill-cream"
            d="M-71 451.6C126.3 340 593.5 145.8 934.5 160.8c313 93.8 497 216 572 280L1511 900L-200 900Z"
          />
          {/* Plum band stroke on top */}
          <path
            stroke="currentColor"
            strokeWidth="160"
            d={BG_PATH}
          />
        </svg>

        {/* Text SVG layered on top */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 1440 442"
          width="100%"
          className="absolute inset-0 h-full w-full pt-1 md:pt-3"
          style={{ overflow: 'visible' }}
          aria-label={data.text || undefined}
        >
          <defs>
            <path d={TEXT_PATH} id="slogan-curve" />
          </defs>
          <text
            width="100%"
            className="fill-cream"
            dominantBaseline="central"
            style={{
              fontSize: '8rem',
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '0.001em',
            }}
          >
            <textPath
              ref={textPathRef}
              alignmentBaseline="middle"
              href="#slogan-curve"
              startOffset="-50%"
            >
              {repeatedText}
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  )
}
