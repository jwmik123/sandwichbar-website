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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thesandwichbar.nl'),
  title: 'The Sandwich Bar - Belegde broodjes en Catering',
  description: 'At The Sandwich Bar, we believe in quality and variety. Our menus offer a wide range of flavors and ingredients, and we are happy to accommodate dietary preferences, including gluten-free, vegetarian, and vegan options.',
  openGraph: {
    title: 'The Sandwich Bar - Belegde broodjes en Catering',
    description: 'At The Sandwich Bar, we believe in quality and variety. Our menus offer a wide range of flavors and ingredients, and we are happy to accommodate dietary preferences, including gluten-free, vegetarian, and vegan options.',
    images: [
      {
        url: '/images/sandwichbetter.webp',
        width: 1200,
        height: 630,
        alt: 'The Sandwich Bar',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Sandwich Bar - Belegde broodjes en Catering',
    description: 'At The Sandwich Bar, we believe in quality and variety. Our menus offer a wide range of flavors and ingredients, and we are happy to accommodate dietary preferences, including gluten-free, vegetarian, and vegan options.',
    images: ['/images/sandwichbetter.webp'],
  },
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
