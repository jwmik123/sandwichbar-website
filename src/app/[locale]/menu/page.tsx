import { getLocale, getTranslations } from 'next-intl/server'
import { sanityFetch } from '@/sanity/lib/live'
import { MENU_SECTION_QUERY } from '@/sanity/lib/queries'
import { MenuSection } from '../../components/menu-section'

export default async function MenuPage() {
  const locale = await getLocale()
  const t = await getTranslations('menuSection')
  const menu = await sanityFetch({
    query: MENU_SECTION_QUERY,
    params: { locale },
  })

  return (
    <main className="min-h-screen bg-cream pt-24">
      <div className="py-8 max-w-4xl mx-auto px-4">
        <h1 className="mb-4 text-left text-4xl font-bold text-plum md:text-5xl">
          {t('title')}
        </h1>
      </div>
      <MenuSection data={menu.data} />
    </main>
  )
}
