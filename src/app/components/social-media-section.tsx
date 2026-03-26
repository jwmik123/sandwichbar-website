'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { useTranslations } from 'next-intl'

gsap.registerPlugin(InertiaPlugin)

export type VideoItem = {
  id: string
  title?: string
  videoUrl?: string
}

// ── Per-card component ────────────────────────────────────────────────────────

function VideoCard({ video }: { video: VideoItem }) {
  return (
    <div className="relative w-full">
      {/* momentum hover wrapper */}
      <div data-momentum-hover-element="" className="relative w-full">
        <div
          data-momentum-hover-target=""
          className="group relative w-full overflow-hidden rounded-xl text-cream will-change-transform"
        >
          {video.videoUrl ? (
            <video
              src={video.videoUrl}
              className="w-full object-cover"
              style={{ aspectRatio: '9/16' }}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <div className="flex items-center justify-center bg-plum/30" style={{ aspectRatio: '9/16' }}>
              <PlayIcon className="h-14 w-14 text-cream/30" />
            </div>
          )}

          {video.title && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-sm font-semibold leading-snug text-cream drop-shadow">
                  {video.title}
                </h3>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export function SocialMediaSection({ videos }: { videos: VideoItem[] }) {
  const t = useTranslations('socialMedia')
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

      const xyMultiplier = 30
      const rotationMultiplier = 20
      const inertiaResistance = 200
      const clampXY = gsap.utils.clamp(-1080, 1080)
      const clampRot = gsap.utils.clamp(-60, 60)

      const root = sectionRef.current
      let prevX = 0,
        prevY = 0
      let velX = 0,
        velY = 0
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
    },
    { scope: sectionRef },
  )

  if (!videos.length) return null

  return (
    <section
      ref={sectionRef}
      data-momentum-hover-init=""
      className="flex items-center justify-center bg-dark py-24"
    >
      <div className="flex w-full max-w-[80em] flex-col px-12">
        <h2 className="mb-12 text-center text-4xl font-bold uppercase tracking-tight text-cream md:text-5xl">
          {t('title')} <span className="font-tomatoes lowercase">TikTok</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
