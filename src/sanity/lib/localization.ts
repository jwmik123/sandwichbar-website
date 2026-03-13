import { DEFAULT_LOCALE } from '../../../sanity.config'

/**
 * Returns the Sanity document ID for a given base ID and locale.
 *
 * The @sanity/document-internationalization plugin stores the default locale
 * at the original ID (e.g. "hero") and other locales at "${id}__i18n_${locale}"
 * (e.g. "hero__i18n_en").
 */
export function localizedId(baseId: string, locale: string): string {
  return locale === DEFAULT_LOCALE ? baseId : `${baseId}__i18n_${locale}`
}

/**
 * GROQ helper: returns the resolved localized document from two candidate IDs.
 * Falls back to the default-locale document when the localized version doesn't exist yet.
 */
export function localizedCoalesce(type: string, baseId: string, fields: string): string {
  return `coalesce(
    *[_type == "${type}" && _id == $${baseId}Id][0]{${fields}},
    *[_type == "${type}" && _id == "${baseId}"][0]{${fields}}
  )`
}
