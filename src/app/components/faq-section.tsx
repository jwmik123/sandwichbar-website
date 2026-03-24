'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

type FaqItem = {
  _key: string
  question?: string | null
  answer?: string | null
}

type FaqSectionProps = {
  items?: FaqItem[] | null
}

function PlusIcon({ open }: { open: boolean }) {
  return (
    <span
      className="relative flex h-6 w-6 shrink-0 items-center justify-center"
      aria-hidden
    >
      <span className="absolute h-0.5 w-4 rounded-full bg-plum transition-transform duration-300" />
      <span
        className={`absolute h-4 w-0.5 rounded-full bg-plum transition-all duration-300 ${
          open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
        }`}
      />
    </span>
  )
}

export function FaqSection({ items }: FaqSectionProps) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const t = useTranslations('faq')

  if (!items?.length) return null

  const mid = Math.ceil(items.length / 2)
  const left = items.slice(0, mid)
  const right = items.slice(mid)

  const titleLines = t('title')

  return (
    <section
      className="px-8 py-16 md:py-20"
      style={{ background: 'color-mix(in srgb, var(--color-plum) 18%, var(--color-cream))' }}
    >
      <div className="mx-auto max-w-7xl">

        <h2
          className="mb-10 font-poppins text-center text-3xl md:text-5xl font-bold uppercase leading-none text-plum md:mb-12"
          
        >
          {titleLines}
        </h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            {left.map((item) => <FaqItem key={item._key} item={item} openKey={openKey} setOpenKey={setOpenKey} />)}
          </div>
          <div className="flex flex-col gap-3">
            {right.map((item) => <FaqItem key={item._key} item={item} openKey={openKey} setOpenKey={setOpenKey} />)}
          </div>
        </div>

      </div>
    </section>
  )
}

function FaqItem({
  item,
  openKey,
  setOpenKey,
}: {
  item: FaqItem
  openKey: string | null
  setOpenKey: (key: string | null) => void
}) {
  const isOpen = openKey === item._key
  return (
    <div className="overflow-hidden rounded-2xl bg-cream shadow-sm">
      <button
        type="button"
        onClick={() => setOpenKey(isOpen ? null : item._key)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-plum"
        aria-expanded={isOpen}
      >
        <span className="font-poppins text-base font-semibold leading-snug">
          {item.question}
        </span>
        <PlusIcon open={isOpen} />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 font-poppins text-sm leading-relaxed text-plum/75">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  )
}
