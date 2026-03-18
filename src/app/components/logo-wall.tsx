'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type LogoItem = {
  _key: string
  logoUrl: string
}

interface LogoWallProps {
  logos: LogoItem[]
}

const LOOP_DELAY = 1.5
const DURATION = 0.9
const SLOT_COUNT = 16

export function LogoWall({ logos }: LogoWallProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current || logos.length === 0) return

    const root = rootRef.current
    const list = root.querySelector('[data-logo-wall-list]') as HTMLElement
    const items = Array.from(list.querySelectorAll('[data-logo-wall-item]')) as HTMLElement[]

    function createTarget(logo: LogoItem): HTMLDivElement {
      const wrapper = document.createElement('div')
      wrapper.setAttribute('data-logo-wall-target', '')
      wrapper.className = 'logo-wall__logo-target'
      const img = document.createElement('img')
      img.src = logo.logoUrl
      img.alt = ''
      img.loading = 'lazy'
      img.className = 'logo-wall__logo-img'
      wrapper.appendChild(img)
      return wrapper
    }

    function shuffle<T>(arr: T[]): T[] {
      const a = [...arr]
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }

    function isVisible(el: HTMLElement) {
      return window.getComputedStyle(el).display !== 'none'
    }

    let visibleItems: HTMLElement[] = []
    let visibleCount = 0
    let pool: HTMLDivElement[] = []
    let pattern: number[] = []
    let patternIndex = 0
    let tl: gsap.core.Timeline | null = null

    function createPool(): HTMLDivElement[] {
      return logos.map((logo) => createTarget(logo))
    }

    function setup() {
      tl?.kill()

      visibleItems = items.filter(isVisible)
      visibleCount = visibleItems.length

      pattern = shuffle(Array.from({ length: visibleCount }, (_, i) => i))
      patternIndex = 0

      items.forEach((item) => {
        item.querySelectorAll('[data-logo-wall-target]').forEach((el) => el.remove())
      })

      pool = shuffle(createPool())
      const front = pool.splice(0, visibleCount)
      pool = shuffle(pool.concat(createPool()))

      for (let i = 0; i < visibleCount; i++) {
        const parent = visibleItems[i].querySelector('[data-logo-wall-target-parent]') as HTMLElement
        parent.appendChild(front[i])
      }

      tl = gsap.timeline({ repeat: -1, repeatDelay: LOOP_DELAY })
      tl.call(swapNext)
    }

    function swapNext() {
      const nowCount = items.filter(isVisible).length
      if (nowCount !== visibleCount) {
        setup()
        return
      }

      if (pool.length === 0) {
        pool = shuffle(createPool())
      }

      const idx = pattern[patternIndex % visibleCount]
      patternIndex++

      const container = visibleItems[idx]
      const parent = container.querySelector('[data-logo-wall-target-parent]') as HTMLElement

      if (parent.querySelectorAll('[data-logo-wall-target]').length > 1) return

      const current = parent.querySelector('[data-logo-wall-target]') as HTMLElement | null
      const incoming = pool.shift()!

      gsap.set(incoming, { yPercent: 50, autoAlpha: 0 })
      parent.appendChild(incoming)

      if (current) {
        gsap.to(current, {
          yPercent: -50,
          autoAlpha: 0,
          duration: DURATION,
          ease: 'expo.inOut',
          onComplete: () => current.remove(),
        })
      }

      gsap.to(incoming, {
        yPercent: 0,
        autoAlpha: 1,
        duration: DURATION,
        ease: 'expo.inOut',
        onComplete: () => gsap.set(incoming, { clearProps: 'transform,opacity,visibility' }),
      })
    }

    setup()

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => tl?.play(),
      onLeave: () => tl?.pause(),
      onEnterBack: () => tl?.play(),
      onLeaveBack: () => tl?.pause(),
    })

    const onVisibility = () => (document.hidden ? tl?.pause() : tl?.play())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      tl?.kill()
      st.kill()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [logos])

  return (
    <div ref={rootRef} className="logo-wall">
      <div className="logo-wall__collection">
        <div data-logo-wall-list="" className="logo-wall__list">
          {Array.from({ length: SLOT_COUNT }, (_, i) => (
            <div key={i} data-logo-wall-item="" className="logo-wall__item">
              <div data-logo-wall-target-parent="" className="logo-wall__logo">
                <div className="logo-wall__logo-before" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
