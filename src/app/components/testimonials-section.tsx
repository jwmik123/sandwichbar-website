'use client'

import { useRef } from 'react'
import { createDataAttribute } from 'next-sanity'
import { useTranslations } from 'next-intl'

type Testimonial = {
  _key: string
  author?: string | null
  quote?: string | null
  rating?: number | null
}

type TestimonialsData = {
  _id: string
  _type: string
  items?: Testimonial[] | null
}

export function TestimonialsSection({ data }: { data: TestimonialsData | null }) {
  const ref = useRef<HTMLElement>(null)
  const t = useTranslations('testimonials')

  if (!data?.items?.length) return null

  const attr = createDataAttribute({
    id: data._id,
    type: data._type,
  })

  return (
    <section
      ref={ref}
      className="px-4 py-24"
    >
      <h2 className="mb-12 text-center text-3xl font-bold text-dark md:text-4xl">
        {t('title')}
      </h2>
      <div
        className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3"
        data-sanity={attr.scope('items').toString()}
      >
        {data.items.map((item) => (
          <div
            key={item._key}
            className="rounded-2xl bg-white/50 p-6"
            data-sanity={attr.scope(`items[_key=="${item._key}"]`).toString()}
          >
            {item.rating && (
              <div className="mb-3 text-plum">
                {'★'.repeat(item.rating)}
                {'☆'.repeat(5 - item.rating)}
              </div>
            )}
            <blockquote
              className="mb-4 italic text-muted"
              data-sanity={attr.scope(`items[_key=="${item._key}"].quote`).toString()}
            >
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <p
              className="font-semibold text-dark"
              data-sanity={attr.scope(`items[_key=="${item._key}"].author`).toString()}
            >
              &mdash; {item.author}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
