'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { TransitionLink } from './transition-link'

export function MemberSection() {
  const t = useTranslations('member')

  return (
    <section className="relative overflow-hidden min-h-[600px] flex items-center">
      {/* Background image with blur */}
      <div className="absolute inset-0">
        <Image
          src="/images/The Sandwichbar 07.webp"
          alt=""
          fill
          className="object-cover scale-105 blur-sm"
          sizes="100vw"
          aria-hidden="true"
        />
        {/* Dark tint overlay */}
        <div className="absolute inset-0 bg-plum/50" />
      </div>

      {/* Content */}
      <div className="relative w-full px-6 py-24">
        <div className="mx-auto max-w-6xl flex flex-col lg:flex-row lg:items-center gap-12">

          {/* heading — sits outside the card on larger screens */}
          <div className="lg:w-2/5 flex flex-col gap-4">
         
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-cream uppercase leading-tight">
              {t('titleWord')}<br />
              <span className="font-tomatoes lowercase text-6xl md:text-8xl leading-none">
                {t('titleAccent')}
              </span>
            </h2>
          </div>

          {/* Floating cream card */}
          <div className="lg:w-3/5 bg-cream rounded-3xl px-8 py-10 shadow-2xl flex flex-col gap-6">

            {/* Loyalty point intro */}
            <p className="text-plum text-lg leading-relaxed">
              {t('p1')}
            </p>

            {/* Rewards */}
            <p className="text-muted text-base leading-relaxed">
              {t('p2')}
            </p>

            {/* QR info */}
            <p className="text-muted text-base leading-relaxed">
              {t('p3')}
            </p>

            <hr className="border-plum/10" />

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-sm text-muted leading-snug flex-1">
                {t('ctaLabel')}
              </p>
              <TransitionLink
                href="https://the-sandwich-bar.app.piggy.eu/"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-plum px-7 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-dark"
              >
                {t('ctaButton')}
              </TransitionLink>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
