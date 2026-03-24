import { defineQuery } from 'next-sanity'

const HERO_FIELDS = `_id, _type, title, subtitle, buttonText, buttonLink`
const FAQ_FIELDS = `_id, _type, items[]{ _key, question, answer }`
const SLOGAN_FIELDS = `_id, _type, text`
const SOCIAL_MEDIA_FIELDS = `_id, _type, videos[]{ _key, title, embedUrl }`
const MENU_FIELDS = `_id, _type, "menuPdfUrl": menuPdf.asset->url`
const TESTIMONIALS_FIELDS = `_id, _type, items[]{ _key, author, quote, rating }`
const CONTACT_FIELDS = `_id, _type, address, phone, email, openingHours[]{ _key, day, time }`
const ABOUT_SECTION_FIELDS = `_id, _type, body`
const CATERING_SECTION_FIELDS = `_id, _type, label, title, body, orderNowText, freeTestLunchText`

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

// aboutSection and cateringSection use the standard @sanity/document-internationalization
// naming convention (e.g. aboutSection__i18n_en), so we look up by ID directly.
export const ABOUT_SECTION_QUERY = defineQuery(
  `coalesce(
    *[_type == "aboutSection" && _id == "aboutSection__i18n_" + $locale][0]{${ABOUT_SECTION_FIELDS}},
    *[_type == "aboutSection" && _id == "aboutSection"][0]{${ABOUT_SECTION_FIELDS}}
  )`
)
export const CATERING_SECTION_QUERY = defineQuery(
  `coalesce(
    *[_type == "cateringSection" && _id == "cateringSection__i18n_" + $locale][0]{${CATERING_SECTION_FIELDS}},
    *[_type == "cateringSection" && _id == "cateringSection"][0]{${CATERING_SECTION_FIELDS}}
  )`
)

export const FAQ_QUERY = defineQuery(
  `coalesce(
    *[_type == "faq" && language == $locale][0]{${FAQ_FIELDS}},
    *[_type == "faq" && language == "nl"][0]{${FAQ_FIELDS}}
  )`
)

export const CATERING_LOGOS_QUERY = defineQuery(
  `*[_type == "cateringLogos"][0]{
    logos[]{ _key, "logoUrl": asset->url }
  }`
)
