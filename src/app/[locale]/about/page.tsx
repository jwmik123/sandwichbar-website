import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations('aboutPage')

  return (
    <main className="min-h-screen bg-cream px-4 pt-24">
      <div className="mx-auto max-w-3xl py-16">
        <h1 className="mb-8 text-4xl font-bold text-dark md:text-5xl">
          {t('title')}
        </h1>
        <div className="space-y-6 text-lg leading-relaxed text-muted">
          <p>{t('p1')}</p>
          <p>{t('p2')}</p>
          <p>{t('p3')}</p>
        </div>
      </div>
    </main>
  )
}
