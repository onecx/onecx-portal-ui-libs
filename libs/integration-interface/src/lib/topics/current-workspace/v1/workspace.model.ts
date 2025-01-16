import { MicrofrontendRegistration } from './mfe-portal-registration.model'
import { Route } from './route.model'

export interface Workspace {
  baseUrl: string
  workspaceName: string
  /**
   * @deprecated will be renamed to workspaceName
   */
  portalName: string
  displayName?: string
  homePage?: string
  routes?: Array<Route>
  /**
   * @deprecated will be removed
   */
  id?: string
  /**
   * @deprecated will be removed
   */
  description?: string
  /**
   * @deprecated will be removed
   */
  themeId?: string
  /**
   * @deprecated will be removed
   */
  themeName?: string
  /**
   * @deprecated will be removed
   */
  footerLabel?: string
  /**
   * @deprecated will be removed
   */
  companyName?: string
  /**
   * @deprecated will be removed
   */
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
    },
  ]
  /**
   * @deprecated will be removed
   */
  microfrontendRegistrations: Array<MicrofrontendRegistration>
  /**
   * @deprecated will be removed
   */
  logoUrl?: string
  /**
   * @deprecated will be removed
   */
  userUploaded?: boolean
  /**
   * @deprecated will be removed
   */
  logoSmallImageUrl?: string
}
