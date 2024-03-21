import { MicrofrontendRegistration } from './mfe-portal-registration.model'

export interface Workspace {
  id?: string
  portalName: string
  /**
   * @deprecated will be removed
   */
  description?: string // deprecaten
  themeId?: string
  themeName?: string
  footerLabel?: string
  homePage?: string
  baseUrl: string
  companyName?: string
  portalRoles?: string[]
  /**
   * @deprecated will be removed
   */
  imageUrls?: string[]
  /**
   * @deprecated will be removed
   */
  address?: {
    city?: string
    country?: string
    postalCode?: string
    street?: string
    streetNo?: string
  }
  /**
   * @deprecated will be removed
   */
  phoneNumber?: string
  /**
   * @deprecated will be removed
   */
  rssFeedUrl?: string
  /**
   * @deprecated will be removed
   */
  subjectLinks?: [
    {
      label?: string
      url?: string
    }
  ]
  /**
   * @deprecated will be removed
   */
  microfrontendRegistrations: Array<MicrofrontendRegistration>
  logoUrl?: string
  /**
   * @deprecated will be removed
   */
  userUploaded?: boolean
  logoSmallImageUrl?: string
}
