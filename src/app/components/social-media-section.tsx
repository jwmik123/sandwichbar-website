'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { createDataAttribute } from 'next-sanity'
import { useTranslations } from 'next-intl'

gsap.registerPlugin(InertiaPlugin)

type Video = {
  _key: string
  title?: string | null
  url?: string | null
  videoFileUrl?: string | null
}

type SocialMediaData = {
  _id: string
  _type: string
  videos?: Video[] | null
}

// ── Per-card interactive video component ─────────────────────────────────────

function VideoCard({
  video,
  sanityAttr,
}: {
  video: Video
  sanityAttr: string
}) {
  const t = useTranslations('socialMedia')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleMouseEnter = () => {
    if (videoRef.current && video.videoFileUrl) {
      videoRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current && video.videoFileUrl) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(videoRef.current.muted)
  }

  return (
    <div
      className="relative w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
      data-sanity={sanityAttr}
    >
      {/* momentum hover wrapper */}
      <div
        data-momentum-hover-element=""
        className="relative w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          data-momentum-hover-target=""
          className="group relative w-full overflow-hidden rounded-xl text-cream will-change-transform"
        >
          {/* 9:16 aspect-ratio spacer */}
          <div className="pt-[177.78%]" />

          {/* Video */}
          {video.videoFileUrl ? (
            <video
              ref={videoRef}
              src={video.videoFileUrl}
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-plum/30">
              <TikTokIcon className="h-14 w-14 text-cream/30" />
            </div>
          )}

          {/* Gradient overlay — always visible at bottom, stronger on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />

          {/* Top-right: mute button */}
          {video.videoFileUrl && (
            <button
              onClick={toggleMute}
              aria-label={isMuted ? t('soundOn') : t('soundOff')}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-cream opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 hover:bg-black/70"
            >
              {isMuted ? <MutedIcon /> : <UnmutedIcon />}
            </button>
          )}

          {/* Center: play/pause overlay on hover */}
          {video.videoFileUrl && (
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? t('pause') : t('play')}
              className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-transform duration-150 hover:scale-110">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </span>
            </button>
          )}

          {/* Bottom: title + TikTok link */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            {video.title && (
              <h3 className="text-sm font-semibold leading-snug text-cream drop-shadow">
                {video.title}
              </h3>
            )}
            {video.url && (
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-1.5 flex items-center gap-1.5 text-xs text-cream/60 transition-colors hover:text-cream"
              >
                <TikTokIcon className="h-3 w-3" />
                {t('watchOnTikTok')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export function SocialMediaSection({ data }: { data: SocialMediaData | null }) {
  const t = useTranslations('socialMedia')
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const xyMultiplier = 30
    const rotationMultiplier = 20
    const inertiaResistance = 200
    const clampXY = gsap.utils.clamp(-1080, 1080)
    const clampRot = gsap.utils.clamp(-60, 60)

    const root = sectionRef.current
    let prevX = 0, prevY = 0
    let velX = 0, velY = 0
    let rafId: number | null = null

    const onMouseMove = (e: MouseEvent) => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        velX = e.clientX - prevX
        velY = e.clientY - prevY
        prevX = e.clientX
        prevY = e.clientY
        rafId = null
      })
    }

    root.addEventListener('mousemove', onMouseMove)

    root.querySelectorAll('[data-momentum-hover-element]').forEach((el) => {
      const onMouseEnter = (e: Event) => {
        const mouseEvent = e as MouseEvent
        const target = el.querySelector('[data-momentum-hover-target]')
        if (!target) return

        const { left, top, width, height } = (target as HTMLElement).getBoundingClientRect()
        const centerX = left + width / 2
        const centerY = top + height / 2
        const offsetX = mouseEvent.clientX - centerX
        const offsetY = mouseEvent.clientY - centerY

        const rawTorque = offsetX * velY - offsetY * velX
        const leverDist = Math.hypot(offsetX, offsetY) || 1
        const angularForce = rawTorque / leverDist

        gsap.to(target, {
          inertia: {
            x: { velocity: clampXY(velX * xyMultiplier), end: 0 },
            y: { velocity: clampXY(velY * xyMultiplier), end: 0 },
            rotation: { velocity: clampRot(angularForce * rotationMultiplier), end: 0 },
            resistance: inertiaResistance,
          },
        })
      }

      el.addEventListener('mouseenter', onMouseEnter)
    })

    return () => {
      root.removeEventListener('mousemove', onMouseMove)
    }
  }, { scope: sectionRef })

  if (!data?.videos?.length) return null

  const attr = createDataAttribute({ id: data._id, type: data._type })

  return (
    <section
      ref={sectionRef}
      data-momentum-hover-init=""
      className="flex items-center justify-center bg-dark py-24"
    >
      <div className="flex w-full max-w-[80em] flex-col px-12">
        <h2 className="mb-12 text-4xl font-bold uppercase tracking-tight text-center text-cream md:text-5xl">
          {t('title')} <span className="font-tomatoes lowercase">TikTok</span>
        </h2>

        <div
          className="flex flex-wrap gap-8"
          data-sanity={attr.scope('videos').toString()}
        >
          {data.videos.map((video) => (
            <VideoCard
              key={video._key}
              video={video}
              sanityAttr={attr.scope(`videos[_key=="${video._key}"]`).toString()}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.24 8.24 0 0 0 4.82 1.54V6.78a4.85 4.85 0 0 1-1.05-.09z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg className="h-6 w-6 translate-x-0.5 text-cream" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg className="h-6 w-6 text-cream" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  )
}

function MutedIcon() {
  return (
    <svg className="h-4 w-4 text-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

function UnmutedIcon() {
  return (
    <svg className="h-4 w-4 text-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}
