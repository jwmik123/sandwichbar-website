'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations, useLocale } from 'next-intl'

gsap.registerPlugin(Draggable, ScrollTrigger)

type Sandwich = {
  id: string
  name: string
  ingredients: string[]
  image: string
}

const SANDWICHES_BY_LOCALE: Record<string, Sandwich[]> = {
  nl: [
    { id: '1', name: 'Avocado Special', ingredients: ['ei', 'rode ui', 'radijs', 'sriracha mayonaise', 'alfalfa kiemen'], image: '/images/The Sandwichbar - Vrijstaand 1.webp' },
    { id: '2', name: 'Spicy Chicken', ingredients: ['rode ui', 'sriracha mayonaise'], image: '/images/The Sandwichbar - Vrijstaand 2.webp' },
    { id: '3', name: 'Mortadella', ingredients: ['mortadella', 'ricotta pesto', 'burrata', 'parmezaan en pistache'], image: '/images/The Sandwichbar - Vrijstaand 3.webp' },
  ],
  en: [
    { id: '1', name: 'Avocado Special', ingredients: ['egg', 'red onion', 'radish', 'sriracha mayonnaise', 'alfalfa sprouts'], image: '/images/The Sandwichbar - Vrijstaand 1.webp' },
    { id: '2', name: 'Spicy Chicken', ingredients: ['red onion', 'sriracha mayonnaise'], image: '/images/The Sandwichbar - Vrijstaand 2.webp' },
    { id: '3', name: 'Mortadella', ingredients: ['mortadella', 'ricotta pesto', 'burrata', 'parmesan and pistachio'], image: '/images/The Sandwichbar - Vrijstaand 3.webp' },
  ],
}

export function SandwichSlider() {
  const t = useTranslations('sandwichSlider')
  const locale = useLocale()
  const SANDWICHES = SANDWICHES_BY_LOCALE[locale] ?? SANDWICHES_BY_LOCALE.nl

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const draggableRef = useRef<Draggable[]>([])
  const [current, setCurrent] = useState(0)
  const [slideWidth, setSlideWidth] = useState(0)

  const maxIndex = SANDWICHES.length - 1

  // Slide width = full viewport width
  useEffect(() => {
    const measure = () => setSlideWidth(window.innerWidth)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const animateTo = useCallback((index: number) => {
    if (slideWidth === 0) return
    const clamped = Math.max(0, Math.min(index, maxIndex))
    setCurrent(clamped)
    gsap.to(trackRef.current, {
      x: -clamped * slideWidth,
      duration: 0.7,
      ease: 'power3.out',
    })
  }, [slideWidth, maxIndex])

  // Draw SVG path on scroll
  useGSAP(() => {
    if (!pathRef.current || !sectionRef.current) return
    const length = pathRef.current.getTotalLength()
    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length })
    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5,
      },
    })
  }, { scope: sectionRef })

  useGSAP(() => {
    if (!trackRef.current || slideWidth === 0) return

    draggableRef.current.forEach((d) => d.kill())

    draggableRef.current = Draggable.create(trackRef.current, {
      type: 'x',
      edgeResistance: 0.85,
      bounds: { minX: -maxIndex * slideWidth, maxX: 0 },
      inertia: false,
      onDragEnd() {
        const x = gsap.getProperty(trackRef.current, 'x') as number
        animateTo(Math.round(-x / slideWidth))
      },
    })

    return () => draggableRef.current.forEach((d) => d.kill())
  }, { scope: sectionRef, dependencies: [slideWidth, animateTo] })

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-cream flex flex-col py-16"
    >
      {/* Background SVG path — drawn on scroll */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d="M 30 20 C 180 30, 380 150, 530 340 C 590 400, 615 460, 582 510 C 550 558, 482 562, 462 518 C 442 474, 464 418, 522 408 C 580 398, 645 445, 685 530 C 740 640, 780 760, 800 900"
          stroke="#4D343F"
          strokeWidth="32"
          strokeLinecap="round"
          opacity="0.1"
        />
      </svg>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex items-end justify-between">
          <h2 className="text-4xl md:text-5xl font-bold text-plum uppercase leading-tight">
            {t('titlePrefix')} <br /> <span className="font-tomatoes lowercase text-6xl">{t('titleAccent')}</span>
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => animateTo(current - 1)}
              disabled={current === 0}
              aria-label={t('prevSlide')}
              className="w-12 h-12 rounded-full border-2 border-plum flex items-center justify-center text-plum transition-all duration-200 hover:bg-plum hover:text-cream disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => animateTo(current + 1)}
              disabled={current === maxIndex}
              aria-label={t('nextSlide')}
              className="w-12 h-12 rounded-full border-2 border-plum flex items-center justify-center text-plum transition-all duration-200 hover:bg-plum hover:text-cream disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Full-bleed slider track — grows to fill remaining height */}
      <div
        ref={trackRef}
        className="flex flex-1 will-change-transform cursor-grab active:cursor-grabbing select-none mt-0"
      >
        {SANDWICHES.map((sandwich) => (
          <div
            key={sandwich.id}
            className="flex-none flex flex-col items-center justify-center"
            style={{ width: slideWidth || '100vw' }}
          >
            {/* Sandwich image — constrained width, transparent background */}
            <div className="relative w-56 md:w-96 lg:w-[480px] aspect-square pointer-events-none">
              <Image
                src={sandwich.image}
                alt={sandwich.name}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 224px, (max-width: 1024px) 384px, 480px"
                draggable={false}
              />
            </div>

            <h3 className="mt-0 text-3xl md:text-4xl font-bold text-plum text-center leading-tight">
              {sandwich.name}
            </h3>

            <p className="mt-3 text-base md:text-lg text-muted text-center leading-relaxed">
              {sandwich.ingredients.join(' · ')}
            </p>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-10">
        {SANDWICHES.map((_, i) => (
          <button
            key={i}
            onClick={() => animateTo(i)}
            aria-label={t('goToSlide', { n: i + 1 })}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 h-2 bg-plum'
                : 'w-2 h-2 bg-plum/30 hover:bg-plum/60'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
