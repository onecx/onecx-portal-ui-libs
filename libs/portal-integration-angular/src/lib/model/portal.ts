import { MicrofrontendRegistration } from './microfrontend'

export interface Portal {
  id?: string
  portalName: string
  description?: string
  themeId?: string
  themeName?: string
  footerLabel?: string
  homePage?: string
  baseUrl: string
  companyName?: string
  portalRoles?: string[]
  imageUrls?: string[]
  address?: {
    city?: string
    country?: string
    postalCode?: string
    street?: string
    streetNo?: string
  }
  phoneNumber?: string
  rssFeedUrl?: string
  subjectLinks?: [
    {
      label?: string
      url?: string
    }
  ]
  microfrontendRegistrations: Array<MicrofrontendRegistration>
  logoUrl?: string
  userUploaded?: boolean
  logoSmallImageUrl?: string
}
