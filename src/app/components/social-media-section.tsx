'use client'

import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { useTranslations } from 'next-intl'

gsap.registerPlugin(InertiaPlugin)

export type VideoItem = {
  id: string
  title?: string
  cover_image_url?: string
  share_url?: string
  embedUrl?: string
}

// ── Per-card component ────────────────────────────────────────────────────────

function extractTikTokVideoId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/)
  return match ? match[1] : null
}

function VideoCard({ video }: { video: VideoItem }) {
  const t = useTranslations('socialMedia')

  const videoId = video.embedUrl ? extractTikTokVideoId(video.embedUrl) : null

  return (
    <div className="relative w-full">
      {/* momentum hover wrapper */}
      <div data-momentum-hover-element="" className="relative w-full">
        <div
          data-momentum-hover-target=""
          className="group relative w-full overflow-hidden rounded-xl text-cream will-change-transform"
        >
          {/* 9:16 aspect-ratio spacer — only for image fallback cards */}
          {!videoId && <div className="pt-[177.78%]" />}

          {videoId ? (
            /* Clipping wrapper — controls visible crop of the TikTok embed */
            <div className="overflow-hidden" style={{ aspectRatio: '9/16' }}>
              <blockquote
                className="tiktok-embed"
                cite={`https://www.tiktok.com/@thesandwichbaramsterdam/video/${videoId}`}
                data-video-id={videoId}
                style={{ maxWidth: '100%', minWidth: '0px', margin: 0 }}
              >
                <section />
              </blockquote>
            </div>
          ) : video.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.cover_image_url}
              alt={video.title ?? ''}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-plum/30">
              <TikTokIcon className="h-14 w-14 text-cream/30" />
            </div>
          )}

          {/* Gradient overlay + bottom info (only for non-embed cards) */}
          {!videoId && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                {video.title && (
                  <h3 className="text-sm font-semibold leading-snug text-cream drop-shadow">
                    {video.title}
                  </h3>
                )}
                {video.share_url && (
                  <a
                    href={video.share_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-cream/60 transition-colors hover:text-cream"
                  >
                    <TikTokIcon className="h-3 w-3" />
                    {t('watchOnTikTok')}
                  </a>
                )}
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

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://www.tiktok.com/embed.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

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

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.24 8.24 0 0 0 4.82 1.54V6.78a4.85 4.85 0 0 1-1.05-.09z" />
    </svg>
  )
}
