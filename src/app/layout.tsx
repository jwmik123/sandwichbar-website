import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { SanityLive } from '@/sanity/lib/live'
import { VisualEditing } from 'next-sanity/visual-editing'
import { draftMode } from 'next/headers'
import { Navigation } from './components/navigation'
import { PageTransition } from './components/page-transition'
import { LenisProvider } from './components/lenis-provider'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'The Sandwich Bar Catering',
  description: 'The best sandwiches in town',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <LenisProvider>
          <PageTransition>
            <Navigation />
            {children}
          </PageTransition>
        </LenisProvider>
        <SanityLive />
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  )
}
