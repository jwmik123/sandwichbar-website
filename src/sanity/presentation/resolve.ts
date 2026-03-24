import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    hero: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Hero', href: '/' }],
      }),
    }),
    slogan: defineLocations({
      select: { title: 'text' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Slogan', href: '/' }],
      }),
    }),
    socialMedia: defineLocations({
      select: { title: '_type' },
      resolve: () => ({
        locations: [{ title: 'Social Media', href: '/' }],
      }),
    }),
    menuSection: defineLocations({
      select: { title: '_type' },
      resolve: () => ({
        locations: [{ title: 'Menu', href: '/' }],
      }),
    }),
    testimonials: defineLocations({
      select: { title: '_type' },
      resolve: () => ({
        locations: [{ title: 'Testimonials', href: '/' }],
      }),
    }),
    contactInfo: defineLocations({
      select: { title: '_type' },
      resolve: () => ({
        locations: [{ title: 'Contact Info', href: '/' }],
      }),
    }),
    aboutSection: defineLocations({
      select: { title: '_type' },
      resolve: () => ({
        locations: [{ title: 'About Section', href: '/' }],
      }),
    }),
    cateringSection: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Catering Section', href: '/' }],
      }),
    }),
  },
}
