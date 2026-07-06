import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { useUserService } from '@onecx/react-integration-interface'

let i18nInitialized = false

const ensureI18nInitialized = (i18n: typeof i18next) => {
  if (i18nInitialized || i18n.isInitialized) {
    i18nInitialized = true
    return
  }
  i18nInitialized = true
  i18n.init({
    fallbackLng: 'en',
    resources: {},
    interpolation: { escapeValue: false },
  })
}

/**
 * Syncs the user language stream with i18next.
 *
 * @returns Null (side-effects only).
 */
export const TranslationBridge = () => {
  const { i18n } = useTranslation()
  const { lang$ } = useUserService()

  ensureI18nInitialized(i18n)

  useEffect(() => {
    const subscription = lang$.subscribe((lang) => {
      void i18n.changeLanguage(lang)
    })

    return () => subscription.unsubscribe()
  }, [i18n, lang$])

  return null
}

export const __resetI18nInitialized = () => {
  i18nInitialized = false
}
