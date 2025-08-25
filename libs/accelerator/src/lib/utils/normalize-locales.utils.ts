export function normalizeLocales(locales: string[] | undefined): string[] {
  if (!locales || locales.length === 0) return []
  const expanded: string[] = []
  for (const locale of locales) {
    if (!expanded.includes(locale)) expanded.push(locale)
    const lang = locale.split(/[-_]/)[0]
    if (!expanded.includes(lang) && !locales.includes(lang)) expanded.push(lang)
  }
  return expanded
}
