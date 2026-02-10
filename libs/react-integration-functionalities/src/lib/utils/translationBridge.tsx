import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useUserService } from '@onecx/react-integration-interface'

export const TranslationBridge = () => {
  const { i18n } = useTranslation()
  const { lang$ } = useUserService()

  useEffect(() => {
    const subscription = lang$.subscribe((lang) => {
      void i18n.changeLanguage(lang)
    })

    return () => subscription.unsubscribe()
  }, [i18n, lang$])

  return null
}
