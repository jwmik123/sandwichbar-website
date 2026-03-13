'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { TransitionLink } from './transition-link'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from '@/i18n/navigation'

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/thesandwichbar',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@thesandwichbar',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
]

export function Navigation() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const logoX = mouse.x * 24
  const logoY = mouse.y * 12

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="relative flex items-start justify-between px-10 pt-10">
        {/* Social links + locale switcher — left */}
        <div className="pointer-events-auto flex flex-col gap-5">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-cream/10 text-cream/70 backdrop-blur-sm transition-colors duration-200 hover:bg-cream/20 hover:text-cream"
            >
              {link.icon}
            </a>
          ))}
          <div className="flex gap-1.5 text-xs text-cream/50 pt-1">
            <TransitionLink href={pathname} locale="nl" className={`transition-colors duration-200 hover:text-cream ${locale === 'nl' ? 'text-cream font-semibold' : ''}`}>NL</TransitionLink>
            <span>/</span>
            <TransitionLink href={pathname} locale="en" className={`transition-colors duration-200 hover:text-cream ${locale === 'en' ? 'text-cream font-semibold' : ''}`}>EN</TransitionLink>
          </div>
        </div>

        {/* Logo — center, parallax */}
        <div
          className="pointer-events-auto absolute left-1/2 top-6"
          style={{
            transform: `translate(calc(-50% + ${logoX}px), ${logoY}px)`,
            transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          <TransitionLink href="/">
            <Image
              src="/images/logo.jpeg"
              alt="The Sandwich Bar Catering"
              width={160}
              height={80}
              className="h-auto w-24 md:w-30 rounded-full"
              priority
            />
          </TransitionLink>
        </div>

        {/* Nav links — right */}
        <div className="pointer-events-auto flex flex-col items-end gap-3">
          {([{ href: '/about', label: t('about') }, { href: '/menu', label: t('menu') }] as const).map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-cream/70 transition-colors duration-200 hover:text-cream"
            >
              {link.label}
            </TransitionLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
