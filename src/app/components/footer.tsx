'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MatterBalls } from './matter-balls'
import { FaqSection } from './faq-section'
import { useTranslations } from 'next-intl'

// ─── Types ────────────────────────────────────────────────────────────────────

type OpeningHour = {
  _key: string
  day?: string | null
  time?: string | null
}

type FaqItem = {
  _key: string
  question?: string | null
  answer?: string | null
}

type FooterProps = {
  openingHours?: OpeningHour[] | null
  phone?: string | null
  email?: string | null
  faqItems?: FaqItem[] | null
}

// ─── Opening Hours hook ───────────────────────────────────────────────────────

const WEEKDAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const WEEKDAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TZ = 'Europe/Amsterdam'

function timeToMinutes(str: string | null | undefined): number | null {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec((str ?? '').trim())
  return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : null
}

function useOpeningStatus(openingHours?: OpeningHour[] | null) {
  const [status, setStatus] = useState({ currentDayIdx: -1, isOpen: false })

  useEffect(() => {
    if (!openingHours?.length) return

    const schedule = WEEKDAY_NAMES.map((name) => {
      const entry = openingHours.find((h) => {
        const d = (h.day ?? '').trim().toLowerCase()
        return d === name.toLowerCase() || d === name.slice(0, 3).toLowerCase()
      })
      if (!entry?.time) return { open: false, openMin: 0, closeMin: 0, overnight: false }
      const match = /(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/.exec(entry.time)
      if (!match) return { open: false, openMin: 0, closeMin: 0, overnight: false }
      const openMin = timeToMinutes(match[1])
      const closeMin = timeToMinutes(match[2])
      if (openMin == null || closeMin == null) return { open: false, openMin: 0, closeMin: 0, overnight: false }
      return { open: true, openMin, closeMin, overnight: openMin > closeMin }
    })

    const evaluate = () => {
      try {
        const fmt = new Intl.DateTimeFormat('en-GB', {
          timeZone: TZ,
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]))
        const curIdx = WEEKDAY_SHORT.indexOf(parts.weekday)
        const nowMin = parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10)
        if (curIdx === -1) return

        const today = schedule[curIdx]
        const yesterday = schedule[(curIdx + 6) % 7]

        let isOpen = false
        if (today.open) {
          isOpen = today.overnight
            ? nowMin >= today.openMin || nowMin < today.closeMin
            : nowMin >= today.openMin && nowMin < today.closeMin
        }
        if (!isOpen && yesterday.open && yesterday.overnight && nowMin < yesterday.closeMin) isOpen = true
        setStatus({ currentDayIdx: curIdx, isOpen })
      } catch { /* silent */ }
    }

    evaluate()
    const timer = setInterval(evaluate, 60_000)
    const onVisible = () => { if (!document.hidden) evaluate() }
    document.addEventListener('visibilitychange', onVisible)
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible) }
  }, [openingHours])

  return status
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
)

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer({ openingHours, phone, email, faqItems }: FooterProps) {
  const { currentDayIdx, isOpen } = useOpeningStatus(openingHours)
  const t = useTranslations('footer')

  return (
    <>
    <FaqSection items={faqItems} />
    <footer className="relative overflow-hidden bg-plum text-cream">

      {/* ── SVG decorative background ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/footer-bg.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-70 opacity-20 -right-90 w-[55%] max-w-none select-none"
      />

      {/* ── Canvas as full-footer background ── */}
      <MatterBalls />

      {/* ── Main content (above canvas) ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-8 md:px-0 pt-16 pb-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">

          {/* Left — big stacked title */}
          <div className="col-span-4 flex flex-col justify-between">
            <p className="font-poppins font-bold leading-none text-cream" style={{ fontSize: 'clamp(2rem, 7vw, 4rem)' }}>
              THE<br />SANDWICH<br />BAR
            </p>
            <p className="mt-8 hidden text-xs uppercase tracking-widest text-cream/50 md:block">
              {t('siteBy')} <a href="https://mikdevelopment.nl" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-orange-500/80 transition-colors">Mik Development</a>
            </p>
          </div>

          {/* Nav links */}
          <div className="col-span-2 flex flex-col gap-2 md:pt-1">
            {([
              { href: '/', label: t('home') },
              { href: '/menu', label: t('menu') },
              { href: '/catering', label: t('catering') },
            ] as const).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xl text-cream/70 transition-colors duration-150 hover:text-cream"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Contact — general + catering */}
          <div className="col-span-3 flex flex-col gap-5 md:pt-1">
            {(email || phone) && (
              <div className="flex flex-col gap-1.5">
                <p className="mb-1 text-xs uppercase tracking-widest text-cream/40">{t('generalContact')}</p>
                {email && (
                  <a href={`mailto:${email}`} className="text-sm text-cream/70 transition-colors duration-150 hover:text-cream">
                    {email}
                  </a>
                )}
                {phone && (
                  <div>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-sm text-cream/70 transition-colors duration-150 hover:text-cream">
                      {phone}
                    </a>
                    <p className="mt-0.5 text-xs text-cream/30">{t('notForCatering')}</p>
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <p className="mb-1 text-xs uppercase tracking-widest text-cream/40">{t('catering')}</p>
              <a href="mailto:orders@thesandwichbar.nl" className="text-sm text-cream/70 transition-colors duration-150 hover:text-cream">
                orders@thesandwichbar.nl
              </a>
              <a href="tel:+31615657447" className="text-sm text-cream/70 transition-colors duration-150 hover:text-cream">
                06-15657447
              </a>
              <a href="tel:+31615004988" className="text-sm text-cream/70 transition-colors duration-150 hover:text-cream">
                06-15004988
              </a>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <Link href="/privacy" className="text-xs text-cream/40 transition-colors duration-150 hover:text-cream/70">
                {t('privacy')}
              </Link>
              <Link href="/terms" className="text-xs text-cream/40 transition-colors duration-150 hover:text-cream/70">
                {t('legal')}
              </Link>
            </div>
          </div>

          {/* Right — tagline + opening status + socials */}
          <div className="col-span-3 flex flex-col gap-6 md:pt-1">
            <p className="max-w-xs text-sm leading-relaxed text-cream/60">
              {t('tagline')}
            </p>

            {/* Opening hours status */}
            {openingHours && openingHours.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isOpen ? 'bg-green-800/40 text-green-300' : 'bg-cream/10 text-cream/40'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-cream/30'}`} />
                    {isOpen ? t('openNow') : t('currentlyClosed')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {openingHours.map((hour, idx) => (
                    <div
                      key={hour._key}
                      className={`flex justify-between gap-4 text-xs ${
                        idx === currentDayIdx ? 'font-medium text-cream' : 'text-cream/40'
                      }`}
                    >
                      <span>{hour.day}</span>
                      <span>{hour.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Socials */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-cream/40">{t('followUs')}</p>
              <div className="flex items-center gap-3">
                {[
                  { href: 'https://instagram.com/thesandwichbarams', label: 'Instagram', Icon: InstagramIcon },
                  { href: 'http://tiktok.com/@thesandwichbaramsterdam', label: 'TikTok', Icon: TikTokIcon },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/60 transition-colors duration-150 hover:border-cream/50 hover:text-cream"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only site credit — shown below all sections */}
      <p className="relative z-10 px-8 pb-6 text-xs uppercase tracking-widest text-cream/50 md:hidden">
        {t('siteBy')} <a href="https://mikdevelopment.nl" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-orange-500/80 transition-colors">Mik Development</a>
      </p>

      {/* Spacer so balls are visible — pointer-events-none lets clicks reach the canvas */}
      <div className="pointer-events-none relative z-10" style={{ height: 'clamp(180px, 25vw, 340px)' }} />

    </footer>
    </>
  )
}
