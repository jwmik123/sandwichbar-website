'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { createDataAttribute } from 'next-sanity'
import { DraggableSticker } from './draggable-sticker'

type AboutSectionData = {
  _id: string
  _type: string
  body?: unknown[] | null
}

export function AboutSection({ data }: { data?: AboutSectionData | null }) {
  if (!data) return null

  const attr = createDataAttribute({
    id: data._id,
    type: data._type,
  })

  return (
    <section className="bg-cream pb-20 px-6 relative">
      <div className="mx-auto max-w-3xl flex flex-col items-center gap-10 text-center">
        <div className="w-full flex justify-center">
          <Image
            src="/images/sandwichbetter.webp"
            alt="The Sandwich Bar locatie"
            width={900}
            height={600}
            className="w-2/3 h-auto aspect-[5/3] object-cover"
          />
        </div>

        {data.body && (
          <div
            className="flex flex-col gap-6 max-w-2xl text-plum text-lg leading-relaxed [&>p]:m-0"
            data-sanity={attr.scope('body').toString()}
          >
            <PortableText value={data.body as Parameters<typeof PortableText>[0]['value']} />
          </div>
        )}
      </div>

      {/* <DraggableSticker
        src="/images/car.png"
        alt="The Sandwich Bar auto"
        initialX={400}
        initialY={-120}
        rotation={-6}
        width={180}
        height={180}
        jiggleDelay={0}
        baseZ={10}
      /> */}
      <DraggableSticker
        src="/images/Mannetjes-broodje-beige.png"
        alt="Mannetje met broodje"
        className="invert opacity-80"
        initialRight={80}
        initialBottom={40}
        rotation={5}
        width={250}
        height={168}
        jiggleDelay={1.1}
        baseZ={11}
      />
    </section>
  )
}
