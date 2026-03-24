'use client'

import Image from 'next/image'
import { useState, useRef, useCallback } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
  initialX?: number
  initialY?: number
  initialRight?: number
  initialBottom?: number
  rotation: number
  width: number
  height: number
  jiggleDelay?: number
  baseZ?: number
}

export function DraggableSticker({
  src,
  alt,
  className,
  initialX = 0,
  initialY = 0,
  initialRight,
  initialBottom,
  rotation,
  width,
  height,
  jiggleDelay = 0,
  baseZ = 10,
}: Props) {
  const usingRightBottom = initialRight !== undefined || initialBottom !== undefined
  const [pos, setPos] = useState<{ x: number; y: number } | null>(
    usingRightBottom ? null : { x: initialX, y: initialY },
  )
  const [isDragging, setIsDragging] = useState(false)
  const [tilt, setTilt] = useState(0)
  const [z, setZ] = useState(baseZ)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ offX: 0, offY: 0, lastX: 0 })

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()

      let currentPos = pos
      if (currentPos === null && wrapperRef.current) {
        currentPos = {
          x: wrapperRef.current.offsetLeft,
          y: wrapperRef.current.offsetTop,
        }
        setPos(currentPos)
      }
      if (currentPos === null) return

      ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
      setIsDragging(true)
      setZ(999)
      drag.current = {
        offX: e.clientX - currentPos.x,
        offY: e.clientY - currentPos.y,
        lastX: e.clientX,
      }
    },
    [pos],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return
      const x = e.clientX - drag.current.offX
      const y = e.clientY - drag.current.offY
      const dx = e.clientX - drag.current.lastX
      drag.current.lastX = e.clientX
      setPos({ x, y })
      setTilt(Math.max(-20, Math.min(20, dx * 1.2)))
    },
    [isDragging],
  )

  const onPointerUp = useCallback(() => {
    setIsDragging(false)
    setTilt(0)
    setTimeout(() => setZ(baseZ), 400)
  }, [baseZ])

  const positionStyle: React.CSSProperties =
    pos !== null
      ? { left: 0, top: 0, transform: `translate(${pos.x}px, ${pos.y}px)` }
      : {
          right: initialRight ?? 0,
          bottom: initialBottom ?? 0,
        }

  return (
    <div
      ref={wrapperRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="hidden md:block"
      style={{
        position: 'absolute',
        ...positionStyle,
        zIndex: z,
        touchAction: 'none',
        willChange: 'transform',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div
        className={isDragging ? 'sticker-grabbed' : 'sticker-idle'}
        style={
          {
            '--base-rot': `${rotation}deg`,
            '--jiggle-delay': `${jiggleDelay}s`,
            transform: isDragging
              ? `rotate(${rotation + tilt}deg) scale(1.08)`
              : `rotate(${rotation}deg) scale(1)`,
            transition: isDragging
              ? 'transform 0.06s ease, filter 0.15s ease'
              : 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease',
            filter: isDragging
              ? 'drop-shadow(0 16px 28px rgba(0,0,0,0.28))'
              : 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))',
            transformOrigin: 'center center',
          } as React.CSSProperties
        }
      >
        <div className="p-3 select-none overflow-hidden">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            draggable={false}
            className={`pointer-events-none block${className ? ` ${className}` : ''}`}
            style={{ width, height: 'auto', mixBlendMode: 'lighten' }}
          />
        </div>
      </div>
    </div>
  )
}
