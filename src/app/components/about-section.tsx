'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { createDataAttribute } from 'next-sanity'
import { PeelSticker } from './peel-sticker'

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
        <div className="relative w-2/3 aspect-[5/3]">
          <Image
            src="/images/locatieshoot/the-sandwichbar-20.webp"
            alt="The Sandwich Bar locatie"
            fill
            className="object-cover object-[center_17%]"
            sizes="(max-width: 768px) 66vw, 512px"
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

      <PeelSticker
        src="/images/mannetje-sticker.png"
        alt="Mannetje met broodje"
        width={230}
        rotation={-7}
        rollDirection={45}
        initialRight={125}
        initialBottom={-30}
        jiggleDelay={1.1}
        baseZ={11}
      />
    </section>
  )
}
