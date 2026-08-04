'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { LOCATIESHOOT_IMAGES } from './locatieshoot-images'

gsap.registerPlugin(Observer)


type Card = {
  baseX: number
  baseY: number
  startY: number
  ySpeed: number
  xSetter: (value: number) => void
  ySetter: (value: number) => void
}

export function ImageWallSection() {
  const wrapperRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const wheelSpeed = 0.6 // wheel/trackpad speed
      const dragSpeed = 1.2 // drag speed
      const gridOverscan = 1 // extra rows and columns generated outside the viewport
      const startOffsetY = 0.33 // vertical offset between columns
      const positionLerp = 0.05 // movement smoothing amount
      const xToYInfluence = 0.2 // horizontal movement influence on vertical movement
      const columnSpeedPattern = [1, 1, 0.9] // column parallax speed pattern
      const minCardScale = 0.5 // minimum card scale while moving
      const scaleLerp = 0.02 // scale animation smoothing amount

      const wrapper = wrapperRef.current
      if (!wrapper) return

      const collection = wrapper.querySelector<HTMLElement>('[data-infinite-grid-collection]')
      const sourceList = wrapper.querySelector<HTMLElement>('[data-infinite-grid-list]')
      if (!collection || !sourceList) return

      const originalItems = Array.from(
        sourceList.querySelectorAll<HTMLElement>('[data-infinite-grid-item]'),
      ).map((item) => item.cloneNode(true) as HTMLElement)

      if (!originalItems.length) return

      let observer: Observer | undefined
      let cards: Card[] = []
      let cardElements: HTMLElement[] = []
      const timers: Record<string, ReturnType<typeof setTimeout> | undefined> = {}
      const size = { itemW: 0, itemH: 0, totalW: 0, totalH: 0 }
      const pos = { x: 0, y: 0, targetX: 0, targetY: 0, startX: 0, startY: 0 }
      const scale = { current: 1, target: 1 }

      function setStatus(status: string) {
        wrapper!.setAttribute('data-infinite-grid-status', status)
      }

      function wrapValue(value: number, total: number) {
        return ((value % total) + total) % total
      }

      function createColumnSpeeds(columns: number) {
        return Array.from(
          { length: columns },
          (_, i) => columnSpeedPattern[i % columnSpeedPattern.length],
        )
      }

      function createItemIndexes(columns: number, rows: number) {
        const total = originalItems.length
        const indexes: number[][] = Array.from({ length: rows }, () => [])
        const used = Array(total).fill(0)
        const centerColumn = Math.floor(columns / 2)
        const centerRow = Math.floor(rows / 2)
        const cells: { row: number; column: number; distance: number }[] = []

        for (let row = 0; row < rows; row++) {
          for (let column = 0; column < columns; column++) {
            cells.push({
              row,
              column,
              distance: Math.abs(row - centerRow) + Math.abs(column - centerColumn),
            })
          }
        }

        cells.sort((a, b) => a.distance - b.distance)

        cells.forEach(({ row, column }) => {
          const blocked = [
            indexes[row][column - 1],
            indexes[row][column + 1],
            row > 0 ? indexes[row - 1][column] : undefined,
            row < rows - 1 ? indexes[row + 1][column] : undefined,
            row > 0 ? indexes[row - 1][column - 1] : undefined,
            row > 0 ? indexes[row - 1][column + 1] : undefined,
            row < rows - 1 ? indexes[row + 1][column - 1] : undefined,
            row < rows - 1 ? indexes[row + 1][column + 1] : undefined,
          ]

          const seed = (row * 17 + column * 31) % total
          let bestIndex = 0
          let bestScore = Infinity

          for (let i = 0; i < total; i++) {
            const itemIndex = (i + seed) % total
            let score = used[itemIndex] * 10 + Math.abs(itemIndex - seed) * 0.01

            if (total > 1 && blocked.includes(itemIndex)) score += 1000

            if (score < bestScore) {
              bestScore = score
              bestIndex = itemIndex
            }
          }

          indexes[row][column] = bestIndex
          used[bestIndex]++
        })

        return indexes
      }

      function buildGrid() {
        if (observer) observer.kill()
        clearTimeout(timers.resize)
        clearTimeout(timers.scroll)
        clearTimeout(timers.scale)
        gsap.ticker.remove(updateGrid)

        setStatus('loading')
        sourceList!.innerHTML = ''

        const measureItem = originalItems[0].cloneNode(true) as HTMLElement
        measureItem.style.position = 'absolute'
        measureItem.style.visibility = 'hidden'
        measureItem.style.pointerEvents = 'none'
        wrapper!.appendChild(measureItem)

        const rect = measureItem.getBoundingClientRect()
        size.itemW = rect.width
        size.itemH = rect.height
        measureItem.remove()

        if (!size.itemW || !size.itemH) return

        const columns = Math.max(
          1,
          Math.ceil(wrapper!.clientWidth / size.itemW) + gridOverscan * 2,
        )
        const rows = Math.max(
          Math.ceil(wrapper!.clientHeight / size.itemH) + gridOverscan * 2,
          Math.ceil(originalItems.length / columns),
        )
        const itemIndexes = createItemIndexes(columns, rows)
        const columnSpeeds = createColumnSpeeds(columns)
        const fragment = document.createDocumentFragment()
        const centerColumn = Math.floor(columns / 2)
        const centerRow = Math.floor(rows / 2)

        size.totalW = columns * size.itemW
        size.totalH = rows * size.itemH
        cards = []
        cardElements = []

        gsap.set(collection, { x: 0, y: 0, force3D: true })

        collection!.style.width = `${size.totalW}px`
        collection!.style.height = `${size.totalH}px`

        for (let row = 0; row < rows; row++) {
          for (let column = 0; column < columns; column++) {
            const item = originalItems[itemIndexes[row][column]].cloneNode(true) as HTMLElement
            const card = item.querySelector<HTMLElement>('[data-infinite-grid-card]')

            cards.push({
              baseX: column * size.itemW,
              baseY: row * size.itemH,
              startY: (column - centerColumn) * size.itemH * startOffsetY,
              ySpeed: columnSpeeds[column],
              xSetter: gsap.quickSetter(item, 'x', 'px') as (value: number) => void,
              ySetter: gsap.quickSetter(item, 'y', 'px') as (value: number) => void,
            })

            if (card) cardElements.push(card)
            if (cards.length > originalItems.length) item.setAttribute('aria-hidden', 'true')

            fragment.appendChild(item)
          }
        }

        sourceList!.appendChild(fragment)

        gsap.set(cardElements, { force3D: true })

        pos.startX = wrapper!.clientWidth * 0.5 - centerColumn * size.itemW - size.itemW * 0.5
        pos.startY = wrapper!.clientHeight * 0.5 - centerRow * size.itemH - size.itemH * 0.5
        pos.x = pos.startX
        pos.y = pos.startY
        pos.targetX = pos.x
        pos.targetY = pos.y
        scale.current = 1
        scale.target = 1

        updateGrid()
        gsap.ticker.add(updateGrid)

        requestAnimationFrame(() => {
          setStatus('idle')
        })

        observer = Observer.create({
          target: wrapper!,
          type: 'wheel,touch,pointer',
          preventDefault: true,
          dragMinimum: 3,
          onPress() {
            setStatus('dragging')
          },
          onRelease() {
            setStatus('idle')
          },
          onStop() {
            setStatus('idle')
          },
          onChange: handleMovement,
        })
      }

      function updateGrid() {
        pos.x += (pos.targetX - pos.x) * positionLerp
        pos.y += (pos.targetY - pos.y) * positionLerp
        scale.current += (scale.target - scale.current) * scaleLerp

        const offsetX = size.itemW * gridOverscan
        const offsetY = size.itemH * gridOverscan
        const scrollY = pos.y - pos.startY

        cards.forEach(({ baseX, baseY, startY, ySpeed, xSetter, ySetter }) => {
          xSetter(wrapValue(baseX + pos.x + offsetX, size.totalW) - offsetX)
          ySetter(
            wrapValue(baseY + pos.startY + startY + scrollY * ySpeed + offsetY, size.totalH) -
              offsetY,
          )
        })

        gsap.set(cardElements, { scale: scale.current })
      }

      function handleMovement(self: Observer) {
        const isWheel = self.event.type === 'wheel'
        const speed = isWheel ? wheelSpeed : dragSpeed
        const deltaX = gsap.utils.clamp(-80, 80, self.deltaX * speed)
        const deltaY = gsap.utils.clamp(-80, 80, self.deltaY * speed)
        const moveX = isWheel ? -deltaX : deltaX
        const moveY = isWheel ? -deltaY : deltaY
        const strength = gsap.utils.clamp(0, 1, Math.max(Math.abs(deltaX), Math.abs(deltaY)) / 80)

        if (isWheel) {
          setStatus('scrolling')

          clearTimeout(timers.scroll)
          timers.scroll = setTimeout(() => {
            setStatus('idle')
          }, 200)
        }

        scale.target = gsap.utils.interpolate(1, minCardScale, strength)

        clearTimeout(timers.scale)
        timers.scale = setTimeout(() => {
          scale.target = 1
        }, 120)

        pos.targetX += moveX
        pos.targetY += moveY + moveX * xToYInfluence
      }

      function handleMouseLeave() {
        setStatus('idle')
        scale.target = 1

        if (observer) {
          observer.disable()
          observer.enable()
        }
      }

      function handleResize() {
        clearTimeout(timers.resize)
        timers.resize = setTimeout(buildGrid, 200)
      }

      window.addEventListener('resize', handleResize)
      document.documentElement.addEventListener('mouseleave', handleMouseLeave)

      buildGrid()

      return () => {
        window.removeEventListener('resize', handleResize)
        document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
        Object.values(timers).forEach((timer) => clearTimeout(timer))
        gsap.ticker.remove(updateGrid)
        observer?.kill()
      }
    },
    { scope: wrapperRef },
  )

  return (
    <section
      ref={wrapperRef}
      data-infinite-grid-status="loading"
      data-infinite-grid-init
      className="infinite-grid bg-plum"
    >
      <div className="infinite-grid__fade">
        <div data-infinite-grid-collection className="infinite-grid__collection">
          <div data-infinite-grid-list className="infinite-grid__list">
            {LOCATIESHOOT_IMAGES.map((src) => (
              <div key={src} data-infinite-grid-item className="infinite-grid__item">
                <div data-infinite-grid-card className="infinite-grid__card">
                  <Image
                    src={src}
                    alt=""
                    fill
                    loading="lazy"
                    className="infinite-grid__card-img"
                    sizes="(max-width: 991px) 45vw, 20vw"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
