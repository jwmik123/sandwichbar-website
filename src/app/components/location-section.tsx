'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'

gsap.registerPlugin(ScrollTrigger)

// ─── Opening Hours Logic ───────────────────────────────────────────────────

const TIMEZONE = 'Europe/Amsterdam'

type DayEntry = {
  day: string
  open: string | null
  close: string | null
}

type ScheduleItem = {
  isOpen: boolean
  openMin: number
  closeMin: number
  overnight: boolean
}

function timeToMinutes(str: string | null): number | null {
  if (!str) return null
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(str)
  return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : null
}

function getNowParts() {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const parts = fmt.formatToParts(new Date())
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]))
  const weekdayIdx = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(map.weekday)
  return { weekdayIdx, nowMin: parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10) }
}

function buildSchedule(days: DayEntry[]): ScheduleItem[] {
  return days.map((d) => {
    const openMin = timeToMinutes(d.open)
    const closeMin = timeToMinutes(d.close)
    if (openMin == null || closeMin == null)
      return { isOpen: false, openMin: 0, closeMin: 0, overnight: false }
    return { isOpen: true, openMin, closeMin, overnight: openMin > closeMin }
  })
}

function evaluateStatus(schedule: ScheduleItem[]) {
  const { weekdayIdx, nowMin } = getNowParts()
  const today = schedule[weekdayIdx]
  const yesterday = schedule[(weekdayIdx + 6) % 7]

  let storeOpen = false
  if (today.isOpen) {
    storeOpen = today.overnight
      ? nowMin >= today.openMin || nowMin < today.closeMin
      : nowMin >= today.openMin && nowMin < today.closeMin
  }
  if (!storeOpen && yesterday.isOpen && yesterday.overnight && nowMin < yesterday.closeMin) {
    storeOpen = true
  }
  return { storeOpen, currentDayIdx: weekdayIdx }
}

function useOpeningHours(days: DayEntry[]) {
  const [state, setState] = useState(() => evaluateStatus(buildSchedule(days)))

  useEffect(() => {
    const schedule = buildSchedule(days)
    const tick = () => setState(evaluateStatus(schedule))
    tick()
    const timer = setInterval(tick, 60_000)
    const visHandler = () => { if (!document.hidden) tick() }
    document.addEventListener('visibilitychange', visHandler)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', visHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}

// ─── Opening Hours Component ───────────────────────────────────────────────

function OpeningHours({ days }: { days: DayEntry[] }) {
  const { storeOpen, currentDayIdx } = useOpeningHours(days)
  const t = useTranslations('location')

  return (
    <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-2xl p-4 w-full border border-plum/10">
      {/* Header row */}
      <div className="flex items-center justify-between px-1 mb-3">
        <h4 className="text-sm font-semibold text-dark uppercase tracking-widest">
          {t('openingHours')}
        </h4>
        <div
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            storeOpen ? 'text-[#008214]' : 'text-[#cc0000]'
          }`}
        >
          <span
            className={`absolute inset-0 rounded-full opacity-10 ${
              storeOpen ? 'bg-[#008214]' : 'bg-[#cc0000]'
            }`}
          />
          <span
            className={`relative w-2 h-2 rounded-full ${
              storeOpen ? 'bg-[#008214]' : 'bg-[#cc0000]'
            }`}
          />
          <span className="relative">{storeOpen ? t('open') : t('closed')}</span>
        </div>
      </div>

      {/* Timetable */}
      <div className="flex flex-col gap-0.5">
        {days.map((entry, i) => {
          const isToday = i === currentDayIdx
          const timeStr =
            entry.open && entry.close
              ? `${entry.open}–${entry.close}`
              : t('closed')
          return (
            <div
              key={entry.day}
              className={`flex justify-between items-center px-3 py-2 rounded-full text-sm transition-colors ${
                isToday
                  ? 'bg-plum/8 font-semibold text-dark'
                  : 'text-muted font-normal'
              }`}
            >
              <span>{t(`days.${entry.day}` as Parameters<typeof t>[0])}</span>
              <span className={isToday ? 'text-dark' : 'text-muted'}>{timeStr}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Location Data ─────────────────────────────────────────────────────────

type LocationData = {
  name: string
  neighborhood: string
  address: string
  mapsUrl: string
  image: string
  schedule: DayEntry[]
}

// TODO: Replace placeholder names, addresses and mapsUrl with real data
const SCHEDULE_NASSAUKADE: DayEntry[] = [
  { day: 'monday',    open: '09:00', close: '17:00' },
  { day: 'tuesday',   open: '09:00', close: '17:00' },
  { day: 'wednesday', open: '09:00', close: '17:00' },
  { day: 'thursday',  open: '09:00', close: '17:00' },
  { day: 'friday',    open: '09:00', close: '17:00' },
  { day: 'saturday',  open: '09:00', close: '17:30' },
  { day: 'sunday',    open: '09:00', close: '17:30' },
]

const SCHEDULE: DayEntry[] = [
  { day: 'monday',    open: '10:00', close: '18:00' },
  { day: 'tuesday',   open: '09:00', close: '18:00' },
  { day: 'wednesday', open: '09:00', close: '12:00' },
  { day: 'thursday',  open: '09:00', close: '18:00' },
  { day: 'friday',    open: '09:00', close: '22:00' },
  { day: 'saturday',  open: '18:00', close: '07:00' },
  { day: 'sunday',    open: null,    close: null     },
]

const LOCATIONS: LocationData[] = [
  {
    name: 'The Sandwich Bar',
    neighborhood: 'Nassaukade',
    address: 'Nassaukade 378H, Amsterdam',
    mapsUrl: 'https://maps.app.goo.gl/CKT2jVSsXiU84Gni9',
    image: '/images/tsb1-location.webp',
    schedule: SCHEDULE_NASSAUKADE,
  },
  {
    name: 'The Sandwich Bar',
    neighborhood: 'Amstelveenseweg',
    address: 'Amstelveenseweg 156, Amsterdam',
    mapsUrl: 'https://maps.app.goo.gl/mBG7LVu3xHNkC4DNA',
    image: '/images/tsb2-location.webp',
    schedule: SCHEDULE,
  },
]

// ─── Location Card ─────────────────────────────────────────────────────────

function LocationCard({ loc }: { loc: LocationData }) {
  const t = useTranslations('location')

  return (
    <div className="flex flex-col">
      {/* Illustration */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
        <Image
          src={loc.image}
          alt={`${loc.neighborhood}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Info */}
      <div className="mt-6 px-1">
        <p className="text-lg font-semibold text-plum mb-1">
          {loc.neighborhood}
        </p>
        <p className="text-sm text-muted">{loc.address}</p>

        {/* Maps link */}
        <a
          href={loc.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-plum border-b border-plum/40 pb-0.5 hover:border-plum transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {t('openInMaps')}
        </a>

        {/* Opening Hours */}
        <OpeningHours days={loc.schedule} />
      </div>
    </div>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────

export function LocationSection() {
  const tSection = useTranslations('location')
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

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

  return (
    <section ref={sectionRef} className="relative w-full bg-cream py-20 px-6 overflow-hidden">
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
          d="M 1440 80 C 1200 120, 980 60, 820 180 C 700 270, 680 390, 720 480 C 760 570, 840 600, 820 680 C 800 750, 720 790, 580 820 C 440 850, 260 830, 0 880"
          stroke="#4D343F"
          strokeWidth="32"
          strokeLinecap="round"
          opacity="0.08"
        />
      </svg>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-plum uppercase leading-tight">
            {tSection('titlePrefix')} <br />
            <span className="font-tomatoes lowercase text-6xl md:text-7xl">{tSection('titleAccent')}</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {LOCATIONS.map((loc) => (
            <LocationCard key={loc.neighborhood} loc={loc} />
          ))}
        </div>
      </div>
    </section>
  )
}
