import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { SanityLive } from '@/sanity/lib/live'
import { VisualEditing } from 'next-sanity/visual-editing'
import { draftMode } from 'next/headers'
import { Navigation } from '../components/navigation'
import { PageTransition } from '../components/page-transition'
import { LenisProvider } from '../components/lenis-provider'
import { IntroAnimation } from '../components/intro-animation'
import { routing } from '@/i18n/routing'
import '../globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'The Sandwich Bar Catering',
  description: 'The best sandwiches in town',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className={`${poppins.className} antialiased`}>
        <IntroAnimation />
        <LenisProvider>
          <PageTransition>
            <Navigation />
            {children}
          </PageTransition>
        </LenisProvider>
      </div>
      <SanityLive />
      {(await draftMode()).isEnabled && <VisualEditing />}
    </NextIntlClientProvider>
  )
}
