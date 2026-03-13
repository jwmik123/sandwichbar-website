import { getLocale, getTranslations } from 'next-intl/server'
import { sanityFetch } from '@/sanity/lib/live'
import { MENU_SECTION_QUERY } from '@/sanity/lib/queries'
import { localizedId } from '@/sanity/lib/localization'
import { MenuSection } from '../../components/menu-section'

export default async function MenuPage() {
  const locale = await getLocale()
  const t = await getTranslations('menuSection')
  const menu = await sanityFetch({
    query: MENU_SECTION_QUERY,
    params: { menuSectionId: localizedId('menuSection', locale) },
  })

  return (
    <main className="min-h-screen pt-24">
      <div className="py-8">
        <h1 className="mb-4 text-center text-4xl font-bold text-dark md:text-5xl">
          {t('title')}
        </h1>
      </div>
      <MenuSection data={menu.data} />
    </main>
  )
}
