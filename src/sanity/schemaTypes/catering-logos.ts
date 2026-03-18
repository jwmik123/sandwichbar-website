import { defineType, defineField } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

export const cateringLogos = defineType({
  name: 'cateringLogos',
  title: 'Catering — Client Logos',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'logos',
      title: 'Client Logos',
      type: 'array',
      options: {
        layout: 'grid',
      },
      of: [{ type: 'image', options: { hotspot: false } }],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Client Logos' }),
  },
})
