'use client'

import { useRef } from 'react'
import { createDataAttribute } from 'next-sanity'
import { useTranslations } from 'next-intl'

type MenuItem = {
  _key: string
  name?: string | null
  description?: string | null
  price?: string | null
}

type Category = {
  _key: string
  name?: string | null
  items?: MenuItem[] | null
}

type MenuData = {
  _id: string
  _type: string
  categories?: Category[] | null
}

export function MenuSection({ data }: { data: MenuData | null }) {
  const ref = useRef<HTMLElement>(null)
  const t = useTranslations('menuSection')

  if (!data?.categories?.length) return null

  const attr = createDataAttribute({
    id: data._id,
    type: data._type,
  })

  return (
    <section
      ref={ref}
      id="menu"
      className="px-4 py-24"
    >
      <h2 className="mb-12 text-center text-3xl font-bold text-dark md:text-4xl">
        {t('title')}
      </h2>
      <div
        className="mx-auto max-w-4xl space-y-12"
        data-sanity={attr.scope('categories').toString()}
      >
        {data.categories.map((category) => (
          <div
            key={category._key}
            data-sanity={attr.scope(`categories[_key=="${category._key}"]`).toString()}
          >
            <h3
              className="mb-6 text-2xl font-bold text-plum"
              data-sanity={attr.scope(`categories[_key=="${category._key}"].name`).toString()}
            >
              {category.name}
            </h3>
            <div className="space-y-3">
              {category.items?.map((item) => (
                <div
                  key={item._key}
                  className="flex items-start justify-between rounded-xl bg-white/50 p-5"
                  data-sanity={attr.scope(`categories[_key=="${category._key}"].items[_key=="${item._key}"]`).toString()}
                >
                  <div className="flex-1">
                    <h4
                      className="font-semibold text-dark"
                      data-sanity={attr.scope(`categories[_key=="${category._key}"].items[_key=="${item._key}"].name`).toString()}
                    >
                      {item.name}
                    </h4>
                    {item.description && (
                      <p
                        className="mt-1 text-sm text-muted"
                        data-sanity={attr.scope(`categories[_key=="${category._key}"].items[_key=="${item._key}"].description`).toString()}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span
                    className="ml-4 font-bold text-plum"
                    data-sanity={attr.scope(`categories[_key=="${category._key}"].items[_key=="${item._key}"].price`).toString()}
                  >
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
