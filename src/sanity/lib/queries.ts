import { defineQuery } from 'next-sanity'

const HERO_FIELDS = `_id, _type, title, subtitle, buttonText, buttonLink`
const SLOGAN_FIELDS = `_id, _type, text`
const SOCIAL_MEDIA_FIELDS = `_id, _type, videos[]{ _key, title, url, "videoFileUrl": videoFile.asset->url }`
const MENU_FIELDS = `_id, _type, categories[]{ _key, name, items[]{ _key, name, description, price } }`
const TESTIMONIALS_FIELDS = `_id, _type, items[]{ _key, author, quote, rating }`
const CONTACT_FIELDS = `_id, _type, address, phone, email, openingHours[]{ _key, day, time }`

export const HERO_QUERY = defineQuery(
  `coalesce(
    *[_type == "hero" && _id == $heroId][0]{${HERO_FIELDS}},
    *[_type == "hero" && _id == "hero"][0]{${HERO_FIELDS}}
  )`
)

export const SLOGAN_QUERY = defineQuery(
  `coalesce(
    *[_type == "slogan" && _id == $sloganId][0]{${SLOGAN_FIELDS}},
    *[_type == "slogan" && _id == "slogan"][0]{${SLOGAN_FIELDS}}
  )`
)

export const SOCIAL_MEDIA_QUERY = defineQuery(
  `coalesce(
    *[_type == "socialMedia" && _id == $socialMediaId][0]{${SOCIAL_MEDIA_FIELDS}},
    *[_type == "socialMedia" && _id == "socialMedia"][0]{${SOCIAL_MEDIA_FIELDS}}
  )`
)

export const MENU_SECTION_QUERY = defineQuery(
  `coalesce(
    *[_type == "menuSection" && _id == $menuSectionId][0]{${MENU_FIELDS}},
    *[_type == "menuSection" && _id == "menuSection"][0]{${MENU_FIELDS}}
  )`
)

export const TESTIMONIALS_QUERY = defineQuery(
  `coalesce(
    *[_type == "testimonials" && _id == $testimonialsId][0]{${TESTIMONIALS_FIELDS}},
    *[_type == "testimonials" && _id == "testimonials"][0]{${TESTIMONIALS_FIELDS}}
  )`
)

export const CONTACT_INFO_QUERY = defineQuery(
  `coalesce(
    *[_type == "contactInfo" && _id == $contactInfoId][0]{${CONTACT_FIELDS}},
    *[_type == "contactInfo" && _id == "contactInfo"][0]{${CONTACT_FIELDS}}
  )`
)
