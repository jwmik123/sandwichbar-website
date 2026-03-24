import Image from 'next/image'
import { PortableText } from '@portabletext/react'

type AboutSectionData = {
  body?: unknown[] | null
}

export function AboutSection({ data }: { data?: AboutSectionData | null }) {
  return (
    <section className="bg-cream pb-20 px-6 relative overflow-hidden">
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

        {data?.body && (
          <div className="flex flex-col gap-6 max-w-2xl text-plum text-lg leading-relaxed [&>p]:m-0">
            <PortableText value={data.body as Parameters<typeof PortableText>[0]['value']} />
          </div>
        )}
      </div>

      <Image
        src="/images/car.png"
        alt=""
        width={420}
        height={420}
        className="absolute bottom-0 right-0 opacity-10 pointer-events-none select-none"
        aria-hidden="true"
      />
    </section>
  )
}
