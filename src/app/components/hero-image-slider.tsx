'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const IMAGES = [
  '/images/The Sandwichbar 01.webp',
  '/images/The Sandwichbar 02.webp',
  '/images/The Sandwichbar 03.webp',
  '/images/The Sandwichbar 04.webp',
  '/images/The Sandwichbar 05.webp',
  '/images/The Sandwichbar 06.webp',
  '/images/The Sandwichbar 07.webp',
  '/images/The Sandwichbar 08.webp',
]

const COL_A = [IMAGES[0], IMAGES[2], IMAGES[4], IMAGES[6]]
const COL_B = [IMAGES[1], IMAGES[3], IMAGES[5], IMAGES[7]]

const GAP = 12 // px — matches gap-3

function ImageColumn({
  images,
  colRef,
  offset = false,
}: {
  images: string[]
  colRef: React.RefObject<HTMLDivElement | null>
  offset?: boolean
}) {
  const all = [...images, ...images]

  return (
    <div className="flex-1 overflow-hidden" style={offset ? { marginTop: '-50%' } : undefined}>
      <div ref={colRef} className="flex flex-col gap-3">
        {all.map((src, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl"
            style={{ aspectRatio: '2/3' }}
            aria-hidden={i >= images.length ? true : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading={i < 4 ? 'eager' : 'lazy'}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function HeroImageSlider() {
  const colARef = useRef<HTMLDivElement>(null)
  const colBRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cols = [
      { ref: colARef, speed: 28 },
      { ref: colBRef, speed: 22 },
    ]

    const tweens: gsap.core.Tween[] = []

    cols.forEach(({ ref, speed }) => {
      const el = ref.current
      if (!el) return

      const children = Array.from(el.children) as HTMLElement[]
      const half = children.length / 2
      let groupHeight = GAP * (half - 1)
      for (let i = 0; i < half; i++) groupHeight += children[i].offsetHeight

      // Animate exactly one group height so the duplicate lines up seamlessly
      const tween = gsap.to(el, {
        y: -(groupHeight + GAP),
        duration: speed,
        ease: 'none',
        repeat: -1,
      })

      tweens.push(tween)
    })

    return () => tweens.forEach((t) => t.kill())
  }, [])

  return (
    <div className="relative flex h-full w-full gap-3 overflow-hidden">
      <ImageColumn images={COL_A} colRef={colARef} />
      <ImageColumn images={COL_B} colRef={colBRef} offset />
    </div>
  )
}
