import { defineType, defineField } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

export const cateringSection = defineType({
  name: 'cateringSection',
  title: 'Catering Section',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'orderNowText',
      title: 'Order Now Button Text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'freeTestLunchText',
      title: 'Free Test Lunch Button Text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})
