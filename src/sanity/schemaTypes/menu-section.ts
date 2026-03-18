import { defineType, defineField } from 'sanity'
import { MenuIcon } from '@sanity/icons'

export const menuSection = defineType({
  name: 'menuSection',
  title: 'Menu',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'menuPdf',
      title: 'Menu PDF',
      type: 'file',
      options: {
        accept: 'application/pdf',
      },
    }),
  ],
})
