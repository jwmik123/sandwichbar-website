'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const IMAGES = ['/images/logo.jpeg', '/images/logo-white.jpeg']
const BASE_RADIUS = 58

export function MatterBalls() {
  const containerRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cleanupFn: (() => void) | undefined

    const setup = async () => {
      const {
        Engine,
        Render,
        Runner,
        Bodies,
        World,
        Events,
        Mouse,
        MouseConstraint,
      } = await import('matter-js')

      const target = targetRef.current
      const container = containerRef.current
      if (!target || !container) return

      const dpr = window.devicePixelRatio || 1
      const width = target.clientWidth
      const height = target.clientHeight

      // Pre-load images at high resolution
      const loadedImages = await Promise.all(
        IMAGES.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve) => {
              const img = new window.Image()
              img.onload = () => resolve(img)
              img.onerror = () => resolve(img)
              img.src = src
            })
        )
      )

      const engine = Engine.create()

      const render = Render.create({
        element: target,
        engine,
        options: {
          width,
          height,
          pixelRatio: dpr,
          background: 'transparent',
          wireframes: false,
        },
      })

      // Static boundaries
      const wallOpts = {
        isStatic: true,
        render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 },
      }
      const ground = Bodies.rectangle(width / 2, height + 25, width + 400, 50, wallOpts)
      const wallL  = Bodies.rectangle(-25, height / 2, 50, height * 4, wallOpts)
      const wallR  = Bodies.rectangle(width + 25, height / 2, 50, height * 4, wallOpts)
      World.add(engine.world, [ground, wallL, wallR])

      // Balls — parked high above, out of view
      type BallInfo = { body: Matter.Body; imgIdx: number; r: number }
      const balls: BallInfo[] = []
      const count = Math.max(8, Math.floor(width / 110))

      for (let i = 0; i < count; i++) {
        const r = BASE_RADIUS + Math.random() * 20 - 10
        const x = r + Math.random() * (width - r * 2)
        const y = -r * 2 - i * (r * 2.6)
        const body = Bodies.circle(x, y, r, {
          restitution: 0.5,
          friction: 0.08,
          frictionAir: 0.01,
          density: 0.002,
          render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 },
        })
        balls.push({ body, imgIdx: i % 2, r })
        World.add(engine.world, body)
      }

      // Custom draw: crisp circular images
      Events.on(render, 'afterRender', () => {
        const ctx = render.context
        for (const { body, imgIdx, r } of balls) {
          const { x, y } = body.position
          const img = loadedImages[imgIdx]

          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(body.angle)

          // Cream background
          ctx.beginPath()
          ctx.arc(0, 0, r, 0, Math.PI * 2)
          ctx.fillStyle = '#FDF4E5'
          ctx.fill()

          // Image clipped to circle
          ctx.save()
          ctx.clip()
          if (img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, -r, -r, r * 2, r * 2)
          }
          ctx.restore()

          // Plum border
          ctx.beginPath()
          ctx.arc(0, 0, r, 0, Math.PI * 2)
          ctx.strokeStyle = '#4D343F'
          ctx.lineWidth = 4
          ctx.stroke()

          ctx.restore()
        }
      })

      // Mouse drag
      const mouse = Mouse.create(render.canvas)
      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      })
      World.add(engine.world, mc)
      render.mouse = mouse

      // Start rendering immediately (so the canvas is ready), but keep physics paused
      Render.run(render)
      const runner = Runner.create()

      // Kick off physics only when the footer scrolls into view
      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top 90%',
        once: true,
        onEnter: () => Runner.run(runner, engine),
      })

      return () => {
        st.kill()
        Render.stop(render)
        Runner.stop(runner)
        World.clear(engine.world, false)
        Engine.clear(engine)
        render.canvas?.remove()
        ;(render as Record<string, unknown>).textures = {}
      }
    }

    setup().then((fn) => { cleanupFn = fn })
    return () => { cleanupFn?.() }
  }, [])

  return (
    <div ref={containerRef} className="canvas-matter">
      <div ref={targetRef} className="canvas-matter__target" />
    </div>
  )
}
