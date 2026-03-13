import { defineQuery } from 'next-sanity'

export const HERO_QUERY = defineQuery(
  `*[_type == "hero" && _id == "hero"][0]{
    _id,
    _type,
    title,
    subtitle,
    buttonText,
    buttonLink
  }`
)

export const SLOGAN_QUERY = defineQuery(
  `*[_type == "slogan" && _id == "slogan"][0]{
    _id,
    _type,
    text
  }`
)

export const SOCIAL_MEDIA_QUERY = defineQuery(
  `*[_type == "socialMedia" && _id == "socialMedia"][0]{
    _id,
    _type,
    videos[]{
      _key,
      title,
      url,
      "videoFileUrl": videoFile.asset->url
    }
  }`
)

export const MENU_SECTION_QUERY = defineQuery(
  `*[_type == "menuSection" && _id == "menuSection"][0]{
    _id,
    _type,
    categories[]{
      _key,
      name,
      items[]{
        _key,
        name,
        description,
        price
      }
    }
  }`
)

export const TESTIMONIALS_QUERY = defineQuery(
  `*[_type == "testimonials" && _id == "testimonials"][0]{
    _id,
    _type,
    items[]{
      _key,
      author,
      quote,
      rating
    }
  }`
)

export const CONTACT_INFO_QUERY = defineQuery(
  `*[_type == "contactInfo" && _id == "contactInfo"][0]{
    _id,
    _type,
    address,
    phone,
    email,
    openingHours[]{
      _key,
      day,
      time
    }
  }`
)
