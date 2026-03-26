import { defineType, defineField, defineArrayMember } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const socialMedia = defineType({
  name: 'socialMedia',
  title: 'Social Media',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
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
            }),
            defineField({
              name: 'video',
              title: 'Video',
              type: 'file',
              options: { accept: 'video/*' },
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
})
