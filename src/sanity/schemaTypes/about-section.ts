import { defineType, defineField } from 'sanity'
import { BlockContentIcon } from '@sanity/icons'

export const aboutSection = defineType({
  name: 'aboutSection',
  title: 'About Section',
  type: 'document',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (rule) => rule.required(),
    }),
  ],
})
