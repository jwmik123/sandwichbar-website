'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  alt: string
  /** rendered sticker width in css pixels */
  width: number
  rotation?: number
  initialRight?: number
  initialBottom?: number
  initialX?: number
  initialY?: number
  baseZ?: number
  jiggleDelay?: number
  /** direction the paper rolls open from, in degrees */
  rollDirection?: number
  className?: string
}

const DURATION = 1.2 // roll duration in seconds for the first apply
const PEEL_DURATION = 0.35 // picking the sticker up: it peels halfway off
const STICK_DURATION = 0.7 // dropping it: it rolls back down flat
const HELD_PROGRESS = 0.5 // how far the sticker stays peeled while held
const ROLL_EASE = 3 // higher = faster start, slower finish
const START_PROGRESS = 0.2 // how much is already unrolled at start
const ROLL_STEPS = 50 // strips used to draw the curl
const BACKING_COLOR = '#FFFFFF'
const FOLLOW = 0.22 // how quickly the sticker catches up with the pointer
const TILT_FOLLOW = 0.18 // how quickly the tilt catches up
const MAX_TILT = 16 // degrees the sticker leans into the drag
const SCALE_FOLLOW = 0.16 // how quickly the lift (scale) eases in and out
const DRAG_SCALE = 1.06 // how much the sticker lifts off the page while held

/**
 * Sticker that "rolls" onto the page: the paper curls open from one corner,
 * with a backing side, a soft shading gradient and a lift shadow.
 * Based on the Osmo sticker effect, adapted to a single, draggable sticker
 * that applies itself when it scrolls into view and re-applies on click.
 */
export function PeelSticker({
  src,
  alt,
  width,
  rotation = 0,
  initialRight,
  initialBottom,
  initialX = 0,
  initialY = 0,
  baseZ = 10,
  jiggleDelay = 0,
  rollDirection = 45,
  className,
}: Props) {
  const usingRightBottom = initialRight !== undefined || initialBottom !== undefined

  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const drawRef = useRef<((progress: number) => void) | null>(null)
  const progressRef = useRef(START_PROGRESS)
  const direction = rollDirection * (Math.PI / 180)

  const innerRef = useRef<HTMLDivElement>(null)
  const posRef = useRef<{ x: number; y: number } | null>(
    usingRightBottom ? null : { x: initialX, y: initialY },
  )
  const targetRef = useRef<{ x: number; y: number }>({ x: initialX, y: initialY })
  const tiltRef = useRef(0)
  const scaleRef = useRef(1)
  const dragRafRef = useRef<number | null>(null)
  const draggingRef = useRef(false)
  const offsetRef = useRef({ x: 0, y: 0 })

  // `detached` flips the sticker from its right/bottom anchor to free positioning.
  const [detached, setDetached] = useState(!usingRightBottom)
  const [isDragging, setIsDragging] = useState(false)
  const [isIdle, setIsIdle] = useState(true)
  const [z, setZ] = useState(baseZ)

  /** Builds the canvas surfaces and returns a draw(progress) function. */
  const setup = useCallback(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image || !image.naturalWidth) return null

    const context = canvas.getContext('2d')
    if (!context) return null

    const ratio = Math.min(window.devicePixelRatio || 1, 2)

    const stickerWidth = width * ratio
    const stickerHeight = (stickerWidth * image.naturalHeight) / image.naturalWidth
    const size = Math.ceil(Math.hypot(stickerWidth, stickerHeight))

    const make = () => {
      const surface = document.createElement('canvas')
      surface.width = surface.height = size
      return surface.getContext('2d')!
    }

    const sourceContext = make()
    const backContext = make()
    const rollContext = make()
    const source = sourceContext.canvas
    const backing = backContext.canvas
    const roll = rollContext.canvas

    canvas.width = canvas.height = size
    canvas.style.width = canvas.style.height = `${size / ratio}px`

    // Rotate the artwork into the roll direction; the canvas is counter-rotated in CSS.
    sourceContext.translate(size / 2, size / 2)
    sourceContext.rotate(direction)
    sourceContext.drawImage(
      image,
      -stickerWidth / 2,
      -stickerHeight / 2,
      stickerWidth,
      stickerHeight,
    )

    // The back of the paper: the sticker silhouette filled with the backing color.
    backContext.drawImage(source, 0, 0)
    backContext.globalCompositeOperation = 'source-atop'
    backContext.fillStyle = BACKING_COLOR
    backContext.fillRect(0, 0, size, size)

    const span =
      Math.abs(Math.sin(direction)) * stickerWidth + Math.abs(Math.cos(direction)) * stickerHeight
    const edge = (size - span) / 2

    const draw = (progress: number) => {
      context.clearRect(0, 0, size, size)
      if (progress >= 1) {
        context.drawImage(source, 0, 0, size, size)
        return
      }

      const front = edge + span * progress
      const remaining = edge + span - front
      const bend = 2.9 * Math.pow(Math.min(1, (1 - progress) / 0.18), 0.65)
      const radius = Math.min(stickerWidth * 0.115, remaining / bend)
      const lift = radius * (1 - Math.cos(bend))

      if (front > 0) {
        context.drawImage(source, 0, 0, size, front, 0, 0, size, front)
      }

      rollContext.clearRect(0, 0, size, size)
      // Keep the paper tightly rolled until the last edge releases and relaxes flat.
      const project = (angle: number) =>
        front + radius * (Math.sin(angle) - (1 - Math.cos(angle)) * 0.42)

      for (let index = 0; index < ROLL_STEPS; index++) {
        const angle = (index / ROLL_STEPS) * bend
        const nextAngle = ((index + 1) / ROLL_STEPS) * bend
        const sourceY = front + angle * radius
        const sourceHeight = (nextAngle - angle) * radius
        const top = project(angle)
        const bottom = project(nextAngle)
        const back = Math.cos(angle) - 0.42 * Math.sin(angle) < 0
        const texture = back ? backing : source
        rollContext.drawImage(
          texture,
          0,
          sourceY,
          size,
          sourceHeight,
          0,
          Math.min(top, bottom),
          size,
          Math.max(0.35, Math.abs(bottom - top)) + 0.35,
        )
      }

      const shading = rollContext.createLinearGradient(
        0,
        front - radius * 0.84,
        0,
        front + radius * 0.67,
      )
      shading.addColorStop(0, 'rgba(255, 255, 255, .2)')
      shading.addColorStop(0.25, 'rgba(0, 0, 0, 0)')
      shading.addColorStop(1, 'rgba(0, 0, 0, .25)')
      rollContext.globalCompositeOperation = 'source-atop'
      rollContext.globalAlpha = Math.min(1, bend / 2.8)
      rollContext.fillStyle = shading
      rollContext.fillRect(0, 0, size, size)
      rollContext.globalAlpha = 1
      rollContext.globalCompositeOperation = 'source-over'

      context.save()
      context.shadowColor = `rgba(28, 28, 24, ${0.22 * Math.min(1, lift / (8 * ratio))})`
      context.shadowBlur = lift * 0.2
      context.shadowOffsetY = lift * 0.075
      context.drawImage(roll, 0, 0, size, size)
      context.restore()
    }

    const drawAndTrack = (progress: number) => {
      progressRef.current = progress
      draw(progress)
    }

    drawRef.current = drawAndTrack
    return drawAndTrack
  }, [width, direction])

  /** Animates the roll from its current progress to `target`. */
  const animateTo = useCallback(
    (target: number, duration: number, ease: number) => {
      const draw = drawRef.current ?? setup()
      if (!draw) return

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        draw(target)
        return
      }

      const from = progressRef.current
      if (Math.abs(target - from) < 0.001) return

      const start = performance.now()
      const animate = (now: number) => {
        const time = Math.min(1, (now - start) / (duration * 1000))
        draw(from + (target - from) * (1 - Math.pow(1 - time, ease)))
        if (time < 1) frameRef.current = requestAnimationFrame(animate)
        else frameRef.current = null
      }
      frameRef.current = requestAnimationFrame(animate)
    },
    [setup],
  )

  /** Rolls the sticker all the way onto the page. */
  const stick = useCallback(
    (duration = STICK_DURATION) => animateTo(1, duration, ROLL_EASE),
    [animateTo],
  )

  /** Peels the sticker halfway off the page while it is being held. */
  const peel = useCallback(() => animateTo(HELD_PROGRESS, PEEL_DURATION, 2), [animateTo])

  // Load the artwork, then play the roll once the sticker scrolls into view.
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    let observer: IntersectionObserver | null = null
    const image = new window.Image()
    image.decoding = 'async'
    image.src = src

    const onReady = () => {
      imageRef.current = image
      setup()
      drawRef.current?.(START_PROGRESS)
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            stick(DURATION)
            observer?.disconnect()
          })
        },
        { threshold: 0.4 },
      )
      observer.observe(wrapper)
    }

    if (image.complete && image.naturalWidth) onReady()
    else image.addEventListener('load', onReady, { once: true })

    return () => {
      observer?.disconnect()
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [src, setup, stick])

  /**
   * Drag runs outside React: every frame the sticker eases towards the pointer
   * and leans into the movement, so the follow stays smooth instead of
   * re-rendering on every pointermove.
   */
  const startLoop = useCallback(() => {
    if (dragRafRef.current !== null) return

    const step = () => {
      const wrapper = wrapperRef.current
      const inner = innerRef.current
      const pos = posRef.current
      if (!wrapper || !inner || !pos) {
        dragRafRef.current = null
        return
      }

      const target = targetRef.current
      const next = {
        x: pos.x + (target.x - pos.x) * FOLLOW,
        y: pos.y + (target.y - pos.y) * FOLLOW,
      }
      posRef.current = next

      const lagX = target.x - next.x
      const lagY = target.y - next.y
      const wantedTilt = draggingRef.current
        ? Math.max(-MAX_TILT, Math.min(MAX_TILT, lagX * 0.9))
        : 0
      tiltRef.current += (wantedTilt - tiltRef.current) * TILT_FOLLOW

      const wantedScale = draggingRef.current ? DRAG_SCALE : 1
      scaleRef.current += (wantedScale - scaleRef.current) * SCALE_FOLLOW

      wrapper.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`
      inner.style.transform = `rotate(${rotation + tiltRef.current}deg) scale(${scaleRef.current})`

      const settled =
        !draggingRef.current &&
        Math.abs(lagX) < 0.3 &&
        Math.abs(lagY) < 0.3 &&
        Math.abs(tiltRef.current) < 0.2 &&
        Math.abs(scaleRef.current - 1) < 0.002

      if (settled) {
        posRef.current = { ...target }
        tiltRef.current = 0
        scaleRef.current = 1
        wrapper.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`
        // Keep the resting transform inline: clearing it would drop the base
        // rotation for a frame (the sticker would flash upright) before the
        // idle animation class is back on.
        inner.style.transform = `rotate(${rotation}deg) scale(1)`
        dragRafRef.current = null
        setIsIdle(true)
        return
      }

      dragRafRef.current = requestAnimationFrame(step)
    }

    dragRafRef.current = requestAnimationFrame(step)
  }, [rotation])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      const wrapper = wrapperRef.current
      if (!wrapper) return

      if (posRef.current === null) {
        posRef.current = { x: wrapper.offsetLeft, y: wrapper.offsetTop }
        targetRef.current = { ...posRef.current }
        // Swap the right/bottom anchor for free positioning in the same frame,
        // otherwise the first drag frame would add its translate on top of the
        // old anchor and the sticker would jump.
        wrapper.style.left = '0px'
        wrapper.style.top = '0px'
        wrapper.style.right = 'auto'
        wrapper.style.bottom = 'auto'
        wrapper.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`
        setDetached(true)
      }

      offsetRef.current = {
        x: e.clientX - posRef.current.x,
        y: e.clientY - posRef.current.y,
      }

      // Pick up where the idle jiggle currently is, so nothing snaps.
      const inner = innerRef.current
      if (inner) {
        const current = getComputedStyle(inner).transform
        if (current && current !== 'none') {
          const matrix = new DOMMatrixReadOnly(current)
          const angle = (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI
          tiltRef.current = angle - rotation
          scaleRef.current = Math.hypot(matrix.a, matrix.b) || 1
        }
        inner.style.transform = `rotate(${rotation + tiltRef.current}deg) scale(${scaleRef.current})`
      }

      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // pointer already released
      }
      draggingRef.current = true
      document.body.classList.add('is-dragging-sticker')
      setIsDragging(true)
      setIsIdle(false)
      setZ(999)
      peel()
      startLoop()
    },
    [peel, startLoop, rotation],
  )

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    targetRef.current = {
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    }
  }, [])

  const onPointerUp = useCallback(() => {
    if (!draggingRef.current) return
    draggingRef.current = false
    document.body.classList.remove('is-dragging-sticker')
    setIsDragging(false)
    setTimeout(() => setZ(baseZ), 400)
    // Dropping it sticks it back down.
    stick()
    startLoop()
  }, [baseZ, stick, startLoop])

  // Place a sticker that starts at free coordinates, and stop the loop on unmount.
  // This must not depend on `detached`: re-running it mid-drag would cancel the
  // drag loop that the pointerdown which flipped `detached` just started.
  useEffect(() => {
    if (!usingRightBottom && posRef.current && wrapperRef.current) {
      const { x, y } = posRef.current
      wrapperRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    return () => {
      if (dragRafRef.current !== null) cancelAnimationFrame(dragRafRef.current)
      dragRafRef.current = null
      document.body.classList.remove('is-dragging-sticker')
    }
  }, [usingRightBottom])

  const positionStyle: React.CSSProperties = detached
    ? { left: 0, top: 0 }
    : { right: initialRight ?? 0, bottom: initialBottom ?? 0 }

  const counterRotation = -rollDirection

  return (
    <div
      ref={wrapperRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={`hidden md:block ${
        isDragging ? 'cursor-grabbing-hand' : 'cursor-grab-hand'
      }${className ? ` ${className}` : ''}`}
      style={{
        position: 'absolute',
        ...positionStyle,
        zIndex: z,
        touchAction: 'none',
        willChange: 'transform',
      }}
    >
      <div
        ref={innerRef}
        className={isIdle ? 'sticker-idle' : undefined}
        style={
          {
            '--base-rot': `${rotation}deg`,
            '--jiggle-delay': `${jiggleDelay}s`,
            transformOrigin: 'center center',
          } as React.CSSProperties
        }
      >
        <canvas
          ref={canvasRef}
          aria-label={alt}
          role="img"
          className="block select-none"
          style={{
            transform: `rotate(${counterRotation}deg)`,
            filter: isDragging
              ? 'drop-shadow(0 18px 26px rgba(56,38,40,0.3))'
              : 'drop-shadow(0 6px 10px rgba(56,38,40,0.18))',
            transition: 'filter 0.25s ease',
          }}
        />
      </div>
    </div>
  )
}
