import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useUserService } from '@onecx/react-integration-interface'

/**
 * Syncs the user language stream with i18next.
 *
 * Skips language changes until i18n is initialized — react-i18next
 * handles initialization via its own provider/boundaries.
 *
 * @returns Null (side-effects only).
 */
export const TranslationBridge = () => {
  const { i18n } = useTranslation()
  const { lang$ } = useUserService()

  useEffect(() => {
    const subscription = lang$.subscribe((lang) => {
      if (i18n.isInitialized) {
        i18n.changeLanguage(lang)
      }
    })

    return () => subscription.unsubscribe()
  }, [i18n, lang$])

  return null
}
