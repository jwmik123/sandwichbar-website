import { sanityFetch } from '@/sanity/lib/live'
import {
  HERO_QUERY,
  SLOGAN_QUERY,
  MENU_SECTION_QUERY,
  TESTIMONIALS_QUERY,
  CONTACT_INFO_QUERY,
  SOCIAL_MEDIA_QUERY,
  ABOUT_SECTION_QUERY,
  CATERING_SECTION_QUERY,
  FAQ_QUERY,
} from '@/sanity/lib/queries'
import type { VideoItem } from '../components/social-media-section'
import { HeroSection } from '../components/hero-section'
import { SloganSection } from '../components/slogan-section'
import { SocialMediaSection } from '../components/social-media-section'
// import { MenuSection } from '../components/menu-section'
import { TestimonialsSection } from '../components/testimonials-section'
import { AboutSection } from '../components/about-section'
import { ImageSection } from '../components/image-section'
import { SandwichSlider } from '../components/sandwich-slider'
import { LocationSection } from '../components/location-section'
import { Footer } from '../components/footer'
import { CateringSection } from '../components/catering-section'
import { MemberSection } from '../components/member-section'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const queryParams = { locale }

  const [hero, slogan, , testimonials, contact, socialMediaData, aboutData, cateringData, faqData] = await Promise.all([
    sanityFetch({ query: HERO_QUERY, params: queryParams }),
    sanityFetch({ query: SLOGAN_QUERY, params: queryParams }),
    sanityFetch({ query: MENU_SECTION_QUERY, params: queryParams }),
    sanityFetch({ query: TESTIMONIALS_QUERY, params: queryParams }),
    sanityFetch({ query: CONTACT_INFO_QUERY, params: queryParams }),
    sanityFetch({ query: SOCIAL_MEDIA_QUERY, params: queryParams }),
    sanityFetch({ query: ABOUT_SECTION_QUERY, params: queryParams }),
    sanityFetch({ query: CATERING_SECTION_QUERY, params: queryParams }),
    sanityFetch({ query: FAQ_QUERY, params: queryParams }),
  ])

  const videos: VideoItem[] = (socialMediaData.data?.videos ?? []).map(
    (v: { _key: string; title?: string; videoUrl?: string }) => ({
      id: v._key,
      title: v.title,
      videoUrl: v.videoUrl,
    }),
  )

  return (
    <>
      <HeroSection data={hero.data} />
      <SloganSection data={slogan.data} />
      <AboutSection data={aboutData.data} />
      <CateringSection data={cateringData.data} />
      <MemberSection />

      <SandwichSlider />
      <ImageSection />
      <SocialMediaSection videos={videos} />
      {/* <MenuSection data={menu.data} /> */}
      <TestimonialsSection data={testimonials.data} />
      <LocationSection />
      <Footer openingHours={contact.data?.openingHours} phone={contact.data?.phone} email={contact.data?.email} faqItems={faqData.data?.items} />
    </>
  )
}
