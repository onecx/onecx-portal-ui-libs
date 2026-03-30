import { normalizeLocales } from './normalize-locales.utils'

export function getNormalizedBrowserLocales(): string[] {
  const navigator = globalThis.navigator as Navigator | undefined
  if (!navigator) {
    return ['en']
  }

  const langs = navigator.languages || [navigator.language]
  return normalizeLocales(langs.filter(Boolean))
}
