import { defineType, defineField, defineArrayMember } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const socialMedia = defineType({
  name: 'socialMedia',
  title: 'Social Media',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
            defineField({
              name: 'videoFile',
              title: 'Video File',
              type: 'file',
            }),
          ],
        }),
      ],
    }),
  ],
})
