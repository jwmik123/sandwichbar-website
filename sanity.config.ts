'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { documentInternationalization } from '@sanity/document-internationalization'
import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'
import { resolve } from './src/sanity/presentation/resolve'

export const SUPPORTED_LANGUAGES = [
  { id: 'nl', title: 'Nederlands' },
  { id: 'en', title: 'English' },
]

export const DEFAULT_LOCALE = 'nl'

const TRANSLATABLE_TYPES = ['hero', 'slogan', 'socialMedia', 'menuSection', 'testimonials', 'contactInfo', 'aboutSection', 'cateringSection', 'faq']

export default defineConfig({
  name: 'sandwichbar',
  title: 'Sandwichbar Website',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [
    structureTool({ structure }),
    visionTool(),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    documentInternationalization({
      supportedLanguages: SUPPORTED_LANGUAGES,
      schemaTypes: TRANSLATABLE_TYPES,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
