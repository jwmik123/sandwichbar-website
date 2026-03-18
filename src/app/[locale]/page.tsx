import { getLocale } from 'next-intl/server'
import { sanityFetch } from '@/sanity/lib/live'
import {
  HERO_QUERY,
  SLOGAN_QUERY,
  MENU_SECTION_QUERY,
  TESTIMONIALS_QUERY,
  CONTACT_INFO_QUERY,
  SOCIAL_MEDIA_QUERY,
} from '@/sanity/lib/queries'
import { getLatestTikToks } from '@/lib/tiktok'
import type { VideoItem } from '../components/social-media-section'
import { HeroSection } from '../components/hero-section'
import { SloganSection } from '../components/slogan-section'
import { SocialMediaSection } from '../components/social-media-section'
import { MenuSection } from '../components/menu-section'
import { TestimonialsSection } from '../components/testimonials-section'
import { ContactSection } from '../components/contact-section'
import { AboutSection } from '../components/about-section'
import { ImageSection } from '../components/image-section'
import { SandwichSlider } from '../components/sandwich-slider'
import { LocationSection } from '../components/location-section'
import { Footer } from '../components/footer'
import { CateringSection } from '../components/catering-section'

export default async function Home() {
  const locale = await getLocale()

  const params = { locale }

  const [hero, slogan, , testimonials, contact, tiktokVideos, socialMediaData] = await Promise.all([
    sanityFetch({ query: HERO_QUERY, params }),
    sanityFetch({ query: SLOGAN_QUERY, params }),
    sanityFetch({ query: MENU_SECTION_QUERY, params }),
    sanityFetch({ query: TESTIMONIALS_QUERY, params }),
    sanityFetch({ query: CONTACT_INFO_QUERY, params }),
    getLatestTikToks().catch(() => []),
    sanityFetch({ query: SOCIAL_MEDIA_QUERY, params }),
  ])

  const videos: VideoItem[] = tiktokVideos.length
    ? tiktokVideos.map((v) => ({ id: v.id, title: v.title, cover_image_url: v.cover_image_url, share_url: v.share_url }))
    : (socialMediaData.data?.videos ?? []).map((v: { _key: string; title?: string; embedUrl?: string }) => ({
        id: v._key,
        title: v.title,
        embedUrl: v.embedUrl,
      }))

  return (
    <>
      <HeroSection data={hero.data} />
      <SloganSection data={slogan.data} />
      <AboutSection />
      <ImageSection />
      <CateringSection />
      <SandwichSlider />
      <SocialMediaSection videos={videos} />
      {/* <MenuSection data={menu.data} /> */}
      <TestimonialsSection data={testimonials.data} />
      <LocationSection />
      <ContactSection data={contact.data} />
      <Footer openingHours={contact.data?.openingHours} />
    </>
  )
}
