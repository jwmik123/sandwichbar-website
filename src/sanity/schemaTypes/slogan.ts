import { defineType, defineField } from 'sanity'
import { BlockContentIcon } from '@sanity/icons'

export const slogan = defineType({
  name: 'slogan',
  title: 'Slogan',
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
      name: 'text',
      title: 'Slogan Text',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
})
