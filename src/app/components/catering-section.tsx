'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { TransitionLink } from './transition-link'

type CateringSectionData = {
  label?: string | null
  title?: string | null
  body?: unknown[] | null
  orderNowText?: string | null
  freeTestLunchText?: string | null
}

export function CateringSection({ data }: { data?: CateringSectionData | null }) {
  return (
    <section className="bg-plum px-6 py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-16">

        {/* Image */}
        <div className="w-full lg:w-2/5 flex-shrink-0">
          <div className="relative w-full aspect-[3/5] overflow-hidden">
            <Image
              src="/images/The Sandwichbar 02.webp"
              alt="The Sandwich Bar catering"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-8 lg:w-3/5">
          <div className="flex flex-col gap-2">
            {data?.label && (
              <span className="text-sm font-semibold uppercase tracking-widest text-cream/50">{data.label}</span>
            )}
            {data?.title && (
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-cream uppercase leading-tight">
                {data.title}
              </h2>
            )}
          </div>

          {data?.body && (
            <div className="flex flex-col gap-5 text-cream/75 text-lg leading-relaxed [&>p]:m-0">
              <PortableText value={data.body as Parameters<typeof PortableText>[0]['value']} />
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-2">
            {data?.orderNowText && (
              <TransitionLink
                href="https://catering.thesandwichbar.nl"
                className="rounded-full border border-cream /40 bg-cream/10 px-7 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-cream hover:text-muted"
              >
                {data.orderNowText}
              </TransitionLink>
            )}
            {data?.freeTestLunchText && (
              <TransitionLink
                href="/catering"
                className="rounded-full border border-cream/40 bg-transparent px-7 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-cream hover:text-muted"
              >
                {data.freeTestLunchText}
              </TransitionLink>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
