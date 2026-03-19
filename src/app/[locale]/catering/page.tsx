import { getLocale, getTranslations } from 'next-intl/server'
import { sanityFetch } from '@/sanity/lib/live'
import { CATERING_LOGOS_QUERY, CONTACT_INFO_QUERY } from '@/sanity/lib/queries'
import { LogoWall } from '../../components/logo-wall'
import { CateringForm } from '../../components/catering-form'
import { HeroImageSlider } from '../../components/hero-image-slider'
import { Footer } from '../../components/footer'
import { TransitionLink } from '../../components/transition-link'

export default async function CateringPage() {
  const locale = await getLocale()
  const t = await getTranslations('cateringPage')
  const c = await getTranslations('catering')

  const [logos, contact] = await Promise.all([
    sanityFetch({ query: CATERING_LOGOS_QUERY }),
    sanityFetch({ query: CONTACT_INFO_QUERY, params: { locale } }),
  ])

  const logoList = logos.data?.logos ?? []

  return (
    <main className="min-h-screen bg-cream">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-plum overflow-hidden px-6 pt-0 pb-0">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            {/* Left — text */}
            <div className="pt-36 pb-20">
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-cream/50">
                {t('heroLabel')}
              </span>
              <h1 className="mb-6 text-5xl font-bold uppercase leading-tightest tracking-tight text-cream md:text-6xl lg:text-7xl">
                {t('heroTitle')}
              </h1>
              <p className="mb-8 max-w-lg text-lg leading-relaxed text-cream/75">
                {t('heroSubtitle')}
              </p>
               <div className="flex flex-wrap mb-8">
                  <TransitionLink
                    href="https://catering.thesandwichbar.nl"
                    className="rounded-full border border-cream /40 bg-cream/10 px-7 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-cream hover:text-muted"
                  >
                    {c('orderNow')}
                  </TransitionLink>
                </div>
              <p className="text-sm text-cream/40">
                {t('heroContact')}
              </p>
            </div>

            {/* Right — vertical masonry slider */}
            <div className="hidden lg:block" style={{ height: '100vh' }}>
              <HeroImageSlider />
            </div>

          </div>
        </div>
      </section>

      {/* ── Logo Wall ────────────────────────────────────────────────────── */}
      {logoList.length > 0 && (
        <section className="bg-cream px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <p className="mb-12 text-center text-xs font-semibold uppercase tracking-widest text-muted/60">
              {t('logosTitle')}
            </p>
            <LogoWall logos={logoList} />
          </div>
        </section>
      )}

      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <section className="bg-cream px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="border-t border-dark/10 pt-16">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">

              {/* Left — copy */}
              <div className="flex flex-col gap-6">
                <span className="text-sm font-semibold uppercase tracking-widest text-muted/60">
                  {t('heroLabel')}
                </span>
                <h2 className="text-4xl font-bold uppercase leading-tight tracking-tight text-dark md:text-5xl">
                  {t('formTitle')}
                </h2>
                <p className="text-lg leading-relaxed text-muted">
                  {t('formSubtitle')}
                </p>
              </div>

              {/* Right — form */}
              <div>
                <CateringForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer openingHours={contact.data?.openingHours} />
    </main>
  )
}
