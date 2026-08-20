type DataLayerEvent = Record<string, unknown>

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[]
  }
}

/**
 * Identifies this site inside the shared GTM container (GTM-KQQWC86W).
 * Kept in sync with the dataLayer seed in src/app/layout.tsx.
 */
export const SITE_NAME = 'thesandwichbar_free_trial'

/**
 * Push an event onto the GTM dataLayer. No-op on the server.
 * `site_name` is stamped on every event so tags in the shared container can be
 * scoped to this site.
 */
export function pushToDataLayer(event: DataLayerEvent) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ site_name: SITE_NAME, ...event })
}

/**
 * Normalise a Dutch phone number to E.164 (+31...).
 * Returns an empty string when there is nothing usable to send.
 */
export function toE164(phone: string, countryCode = '31'): string {
  const cleaned = phone.replace(/[^\d+]/g, '')
  if (!cleaned) return ''

  let digits = cleaned.startsWith('+')
    ? cleaned.slice(1).replace(/\D/g, '')
    : cleaned.replace(/\D/g, '')

  if (!cleaned.startsWith('+')) {
    if (digits.startsWith('00')) digits = digits.slice(2)
    else if (digits.startsWith('0')) digits = countryCode + digits.slice(1)
    else if (!digits.startsWith(countryCode)) digits = countryCode + digits
  }

  return digits ? `+${digits}` : ''
}

/** Split a single free-text name field into first and last name. */
export function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: '', lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}
