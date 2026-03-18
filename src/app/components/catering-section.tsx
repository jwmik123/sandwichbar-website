'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { TransitionLink } from './transition-link'

export function CateringSection() {
  const t = useTranslations('catering')

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
            <span className="text-sm font-semibold uppercase tracking-widest text-cream/50">{t('label')}</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-cream uppercase leading-tight">
              {t('title')}
            </h2>
          </div>

          <div className="flex flex-col gap-5 text-cream/75 text-lg leading-relaxed">
            <p>{t('p1')}</p>
            <p>{t('p2')}</p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <TransitionLink
              href="https://catering.thesandwichbar.nl"
              className="rounded-full border border-cream /40 bg-cream/10 px-7 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-cream hover:text-muted"
            >
              {t('orderNow')}
            </TransitionLink>
            <TransitionLink
              href="/catering"
              className="rounded-full border border-cream/40 bg-transparent px-7 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-cream hover:text-muted"
            >
              {t('freeTestLunch')}
            </TransitionLink>
          </div>
        </div>

      </div>
    </section>
  )
}
