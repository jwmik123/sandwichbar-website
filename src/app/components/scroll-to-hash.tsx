'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Scrolls to the element matching the URL hash after a client-side navigation.
 * The page transition overlay delays the route push, so Next.js' own hash
 * scrolling can run before the target section is mounted — this retries over a
 * few frames until the element exists.
 */
export function ScrollToHash() {
  const pathname = usePathname()

  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return

    let frames = 0
    let raf = 0

    const tryScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' })
        return
      }
      if (frames++ < 60) raf = requestAnimationFrame(tryScroll)
    }

    raf = requestAnimationFrame(tryScroll)
    return () => cancelAnimationFrame(raf)
  }, [pathname])

  return null
}
