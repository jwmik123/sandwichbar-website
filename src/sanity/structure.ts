import type { StructureResolver } from 'sanity/structure'
import { HomeIcon, BlockContentIcon, PlayIcon, MenuIcon, UsersIcon, EnvelopeIcon, HelpCircleIcon } from '@sanity/icons'

const SINGLETONS = ['hero', 'slogan', 'socialMedia', 'menuSection', 'testimonials', 'contactInfo', 'aboutSection', 'cateringSection', 'faq']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(
          S.list()
            .title('Homepage')
            .items([
              S.listItem()
                .title('Hero')
                .icon(HomeIcon)
                .child(S.document().schemaType('hero').documentId('hero').title('Hero')),

              S.listItem()
                .title('Slogan')
                .icon(BlockContentIcon)
                .child(S.document().schemaType('slogan').documentId('slogan').title('Slogan')),

              S.listItem()
                .title('Social Media')
                .icon(PlayIcon)
                .child(S.document().schemaType('socialMedia').documentId('socialMedia').title('Social Media')),

              S.listItem()
                .title('Menu')
                .icon(MenuIcon)
                .child(S.document().schemaType('menuSection').documentId('menuSection').title('Menu')),

              S.listItem()
                .title('Testimonials')
                .icon(UsersIcon)
                .child(S.document().schemaType('testimonials').documentId('testimonials').title('Testimonials')),

              S.listItem()
                .title('Contact Info')
                .icon(EnvelopeIcon)
                .child(S.document().schemaType('contactInfo').documentId('contactInfo').title('Contact Info')),

              S.listItem()
                .title('About Section')
                .icon(BlockContentIcon)
                .child(S.document().schemaType('aboutSection').documentId('aboutSection').title('About Section')),

              S.listItem()
                .title('Catering Section')
                .icon(EnvelopeIcon)
                .child(S.document().schemaType('cateringSection').documentId('cateringSection').title('Catering Section')),

              S.listItem()
                .title('FAQ')
                .icon(HelpCircleIcon)
                .child(S.document().schemaType('faq').documentId('faq').title('FAQ')),
            ]),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as string),
      ),
    ])
