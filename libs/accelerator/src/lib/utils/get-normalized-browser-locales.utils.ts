import { normalizeLocales } from './normalize-locales.utils'

export function getNormalizedBrowserLocales(): string[] {
  if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
    return ['en']
  }

  const langs = window.navigator.languages || [window.navigator.language]
  return normalizeLocales(langs.filter(Boolean))
}
