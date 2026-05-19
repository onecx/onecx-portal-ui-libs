import type { UserProfile } from '../topics/user-profile/v1/user-profile.model'

type GetNormalizedBrowserLocales = () => string[]

type DetermineBrowserLanguage = () => string | undefined

/**
 * Determines the browser language using globalThis.
 *
 * @returns Browser language code or undefined when unavailable.
 */
const determineBrowserLanguage = (): string | undefined => {
  const windowRef = globalThis.window
  if (!windowRef || !windowRef.navigator) {
    return undefined
  }

  let browserLang: string | undefined = windowRef.navigator.languages?.[0]
  browserLang = browserLang || windowRef.navigator.language

  if (!browserLang) {
    return undefined
  }

  if (browserLang.includes('-')) {
    browserLang = browserLang.split('-')[0]
  }

  if (browserLang.includes('_')) {
    browserLang = browserLang.split('_')[0]
  }

  return browserLang
}

/**
 * Resolves legacy language settings from the profile.
 *
 * @param profile - User profile payload.
 * @param defaultLang - Default language fallback.
 * @param determineLang - Optional browser language resolver.
 * @returns Resolved language code.
 */
const resolveLegacyLanguage = (
  profile: UserProfile,
  defaultLang: string,
  determineLang: DetermineBrowserLanguage = determineBrowserLanguage
): string => {
  return profile.accountSettings?.localeAndTimeSettings?.locale ?? determineLang() ?? defaultLang
}

/**
 * Resolves the preferred language from the profile settings.
 *
 * @param profile - User profile payload.
 * @param defaultLang - Default language fallback.
 * @param getNormalizedLocales - Function returning normalized browser locales.
 * @param determineLang - Optional browser language resolver.
 * @returns Resolved language code.
 */
const resolveProfileLanguage = (
  profile: UserProfile,
  defaultLang: string,
  getNormalizedLocales: GetNormalizedBrowserLocales,
  determineLang: DetermineBrowserLanguage = determineBrowserLanguage
): string => {
  let locales = profile.settings?.locales

  if (!locales) {
    return resolveLegacyLanguage(profile, defaultLang, determineLang)
  }

  if (locales.length === 0) {
    locales = getNormalizedLocales()
  }

  const firstLang = locales.find((lang) => lang.length === 2)
  return firstLang ?? defaultLang
}

export { determineBrowserLanguage, resolveLegacyLanguage, resolveProfileLanguage }
export type { DetermineBrowserLanguage, GetNormalizedBrowserLocales }
