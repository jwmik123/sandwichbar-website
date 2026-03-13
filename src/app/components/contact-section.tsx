'use client'

import { useRef } from 'react'
import { createDataAttribute } from 'next-sanity'

type OpeningHour = {
  _key: string
  day?: string | null
  time?: string | null
}

type ContactData = {
  _id: string
  _type: string
  address?: string | null
  phone?: string | null
  email?: string | null
  openingHours?: OpeningHour[] | null
}

export function ContactSection({ data }: { data: ContactData | null }) {
  const ref = useRef<HTMLElement>(null)

  if (!data) return null

  const attr = createDataAttribute({
    id: data._id,
    type: data._type,
  })

  return (
    <section
      ref={ref}
      className="bg-dark px-4 py-24 text-cream/80"
    >
      <h2 className="mb-12 text-center text-3xl font-bold text-cream md:text-4xl">
        Visit Us
      </h2>
      <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
        <div className="space-y-6">
          {data.address && (
            <div>
              <h3 className="mb-2 text-lg font-semibold text-cream">Address</h3>
              <p
                className="whitespace-pre-line"
                data-sanity={attr.scope('address').toString()}
              >
                {data.address}
              </p>
            </div>
          )}
          {data.phone && (
            <div>
              <h3 className="mb-2 text-lg font-semibold text-cream">Phone</h3>
              <p data-sanity={attr.scope('phone').toString()}>
                <a href={`tel:${data.phone}`} className="hover:text-cream">
                  {data.phone}
                </a>
              </p>
            </div>
          )}
          {data.email && (
            <div>
              <h3 className="mb-2 text-lg font-semibold text-cream">Email</h3>
              <p data-sanity={attr.scope('email').toString()}>
                <a href={`mailto:${data.email}`} className="hover:text-cream">
                  {data.email}
                </a>
              </p>
            </div>
          )}
        </div>
        {data.openingHours?.length ? (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-cream">Opening Hours</h3>
            <dl
              className="space-y-2"
              data-sanity={attr.scope('openingHours').toString()}
            >
              {data.openingHours.map((hour) => (
                <div
                  key={hour._key}
                  className="flex justify-between"
                  data-sanity={attr.scope(`openingHours[_key=="${hour._key}"]`).toString()}
                >
                  <dt className="font-medium">{hour.day}</dt>
                  <dd className="text-cream/60">{hour.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </section>
  )
}
