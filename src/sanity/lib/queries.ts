import { defineQuery } from 'next-sanity'

const HERO_FIELDS = `_id, _type, title, subtitle, buttonText, buttonLink`
const SLOGAN_FIELDS = `_id, _type, text`
const SOCIAL_MEDIA_FIELDS = `_id, _type, videos[]{ _key, title, url, "videoFileUrl": videoFile.asset->url }`
const MENU_FIELDS = `_id, _type, "menuPdfUrl": menuPdf.asset->url`
const TESTIMONIALS_FIELDS = `_id, _type, items[]{ _key, author, quote, rating }`
const CONTACT_FIELDS = `_id, _type, address, phone, email, openingHours[]{ _key, day, time }`

// Resolves a translated document via the translation.metadata document.
// Falls back to the default-locale document if no translation exists.
function translatedQuery(type: string, baseId: string, fields: string): string {
  return `coalesce(
    *[_type == "translation.metadata" && $locale in translations[].language && references("${baseId}")][0]
      .translations[language == $locale][0].value->{${fields}},
    *[_type == "${type}" && _id == "${baseId}"][0]{${fields}}
  )`
}

export const HERO_QUERY = defineQuery(translatedQuery('hero', 'hero', HERO_FIELDS))
export const SLOGAN_QUERY = defineQuery(translatedQuery('slogan', 'slogan', SLOGAN_FIELDS))
export const SOCIAL_MEDIA_QUERY = defineQuery(translatedQuery('socialMedia', 'socialMedia', SOCIAL_MEDIA_FIELDS))
export const MENU_SECTION_QUERY = defineQuery(translatedQuery('menuSection', 'menuSection', MENU_FIELDS))
export const TESTIMONIALS_QUERY = defineQuery(translatedQuery('testimonials', 'testimonials', TESTIMONIALS_FIELDS))
export const CONTACT_INFO_QUERY = defineQuery(translatedQuery('contactInfo', 'contactInfo', CONTACT_FIELDS))

export const CATERING_LOGOS_QUERY = defineQuery(
  `*[_type == "cateringLogos"][0]{
    logos[]{ _key, "logoUrl": asset->url }
  }`
)
