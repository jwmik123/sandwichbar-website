'use client'

import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(DrawSVGPlugin)

type TransitionContextType = {
  navigate: (href: string) => void
  isAnimating: boolean
}

const TransitionContext = createContext<TransitionContextType>({
  navigate: () => {},
  isAnimating: false,
})

export function usePageTransition() {
  return useContext(TransitionContext)
}

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const pathRef = useRef<SVGPathElement>(null)
  const animatingRef = useRef(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const pendingPathRef = useRef<string | null>(null)

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const navigate = useCallback(
    (href: string) => {
      if (animatingRef.current || href === pathname) return
      animatingRef.current = true
      setIsAnimating(true)

      const svgPath = pathRef.current

      if (!svgPath || reducedMotion) {
        router.push(href)
        animatingRef.current = false
        setIsAnimating(false)
        return
      }

      pendingPathRef.current = href

      // --- Leave animation ---
      const tl = gsap.timeline({
        onComplete: () => {
          router.push(href)
        },
      })

      tl.set(svgPath, {
        strokeWidth: '5%',
        drawSVG: '0% 0%',
      })

      tl.to(svgPath, {
        duration: 1,
        drawSVG: '0% 85%',
        ease: 'power1.inOut',
      })

      tl.to(
        svgPath,
        {
          strokeWidth: '30%',
          duration: 0.75,
          ease: 'power1.inOut',
        },
        '< 0.25',
      )
    },
    [router, pathname, reducedMotion],
  )

  // --- Enter animation after route change ---
  useEffect(() => {
    if (!pendingPathRef.current || pathname !== pendingPathRef.current) return

    pendingPathRef.current = null
    const svgPath = pathRef.current

    if (!svgPath) {
      animatingRef.current = false
      setIsAnimating(false)
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false
        setIsAnimating(false)
        gsap.set(svgPath, { strokeWidth: 0 })
      },
    })

    tl.set(svgPath, { drawSVG: '0% 100%' })

    tl.to(svgPath, {
      duration: 1.25,
      drawSVG: '100% 100%',
      strokeWidth: '5%',
      ease: 'power1.inOut',
    })

    const h1 = document.querySelector('main h1, section h1')
    if (h1) {
      tl.fromTo(
        h1,
        { yPercent: 25, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, ease: 'expo.out', duration: 1 },
        '< 0.75',
      )
    }
  }, [pathname])

  return (
    <TransitionContext.Provider value={{ navigate, isAnimating }}>
      {children}

      {/* Transition overlay */}
      <div
        data-transition-wrap
        className="pointer-events-none fixed inset-0 z-[9999] overflow-clip"
        aria-hidden="true"
      >
        <div className="absolute inset-0 text-plum">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            viewBox="0 0 1000 1000"
            fill="none"
            preserveAspectRatio="none"
            className="absolute top-[-15%] left-[-15%] h-[130%] w-[130%]"
          >
            <path
              ref={pathRef}
              d="M43 259C296 11.5688 994 -3 922.994 498.259C851.988 999.517 281.229 1004.28 123 767C-35.2287 529.721 179 259 472 259C765 259 792 498.259 659 654C526 809.741 319 755 285 669.001C251 583.001 299 452 496 452C693 452 876.073 639.171 935 937.001"
              stroke="currentColor"
              strokeWidth="0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </TransitionContext.Provider>
  )
}
