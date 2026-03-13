import { defineType, defineField, defineArrayMember } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export const testimonials = defineType({
  name: 'testimonials',
  title: 'Testimonials',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'items',
      title: 'Testimonials',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'author',
              title: 'Author',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'rating',
              title: 'Rating',
              type: 'number',
              validation: (rule) => rule.min(1).max(5),
            }),
          ],
          preview: {
            select: { title: 'author', subtitle: 'quote' },
          },
        }),
      ],
    }),
  ],
})
