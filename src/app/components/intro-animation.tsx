'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function IntroAnimation() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const carRef = useRef<HTMLImageElement>(null)
  const roadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const car = carRef.current
    const road = roadRef.current
    if (!overlay) return

    if (sessionStorage.getItem('intro-seen')) {
      overlay.style.display = 'none'
      return
    }

    sessionStorage.setItem('intro-seen', '1')

    // Hide hero elements — revealed after overlay leaves
    const heroTitle = document.querySelector('[data-hero-title]')
    const heroSubtitle = document.querySelector('[data-hero-subtitle]')
    const heroButton = document.querySelector('[data-hero-button]')
    gsap.set([heroTitle, heroSubtitle, heroButton], { autoAlpha: 0, y: 20 })

    const startAnimation = () => {
      const tl = gsap.timeline()

      // Road draws itself ahead of the car — power2.in is faster early than car's power3.in
      if (road) {
        tl.to(road, { width: window.innerWidth + 400, duration: 1.8, ease: 'power2.in' }, 0)
      }

      if (car) {
        // Pivot at rear wheels (bottom-left of image) for realistic wheelie
        gsap.set(car, { transformOrigin: '15% 100%' })

        // x: crawls then launches — power3.in gives a dramatic slow-to-fast arc
        tl.to(car, { x: window.innerWidth + 400, duration: 2.2, ease: 'power3.in' }, 0)

        // Front wheels lift as car accelerates
        tl.to(car, { rotation: -7, duration: 0.55, ease: 'power1.out' }, 0.25)

        // Front wheels slam back down
        tl.to(car, { rotation: 0, duration: 0.18, ease: 'power3.in' }, 1.55)

        // Front suspension compresses then slowly recovers — pivot at rear so only nose dips
        // tl.to(car, { rotation: 3, duration: 0.2, ease: 'power2.out' }, 1.73)
        // tl.to(car, { rotation: 0, duration: 0.7, ease: 'power3.out' }, 1.93)
      }

      // Overlay slides right
      tl.to(overlay, { xPercent: 200, duration: 1.4, ease: 'power3.inOut' })

      // Hero elements animate in one by one
      tl.call(() => {
        overlay.style.display = 'none'
        const heroTl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.inOut' } })
        if (heroTitle) heroTl.to(heroTitle, { autoAlpha: 1, y: 0 })
        if (heroSubtitle) heroTl.to(heroSubtitle, { autoAlpha: 1, y: 0 }, '<0.2')
        if (heroButton) heroTl.to(heroButton, { autoAlpha: 1, y: 0 }, '<0.2')
      }, undefined, '-=0.5')
    }

    // Wait for all resources (images, fonts, etc.) to load before starting
    if (document.readyState === 'complete') {
      startAnimation()
    } else {
      window.addEventListener('load', startAnimation, { once: true })
    }
  }, [])

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[9000] bg-plum overflow-hidden">
      {/* Road line — starts at car's off-screen x, grows rightward ahead of the car */}
      <div
        ref={roadRef}
        className="absolute h-px bg-cream/80"
        style={{ top: 'calc(50% + 64px)', left: '-400px', width: 0 }}
      />

      {/* Flex wrapper handles vertical centering so GSAP owns the full transform on the car */}
      <div className="absolute inset-0 flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={carRef}
          src="/images/movingcar.svg"
          alt=""
          aria-hidden="true"
          className="h-32 w-auto invert sepia-[.5] saturate-[2] brightness-[.8]"
          style={{ transform: 'translateX(-400px)' }}
        />
      </div>
    </div>
  )
}
