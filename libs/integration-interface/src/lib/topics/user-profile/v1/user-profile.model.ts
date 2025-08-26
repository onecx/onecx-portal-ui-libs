export interface UserProfile {
  userId: string
  person: UserPerson
  organization?: string
  tenantId?: string
  issuer?: string
  settings?: UserSettings
  accountSettings?: UserProfileAccountSettings
  /**
   * @deprecated
   */
  id?: string
  /**
   * @deprecated
   */
  identityProvider?: string
  /**
   * @deprecated
   * user id in external identity provider, e.g. in keycloak
   */
  identityProviderId?: string
  /**
   * @deprecated
   */
  tenantName?: string
  /**
   * @deprecated
   */
  avatar?: AvatarInfo
  /**
   * @deprecated
   */
  memberships?: Array<Membership>
}

export interface UserSettings {
  locales?: string[]
}

export interface UserProfileAccountSettings {
  localeAndTimeSettings?: UserProfileAccountSettingsLocaleAndTimeSettings
  layoutAndThemeSettings?: UserProfileAccountSettingsLayoutAndThemeSettings
  /**
   * @deprecated
   */
  privacySettings?: UserProfileAccountSettingsPrivacySettings
  /**
   * @deprecated
   */
  notificationSettings?: UserProfileAccountSettingsNotificationSettings
}

export interface UserProfileAccountSettingsLocaleAndTimeSettings {
  locale?: string
  timezone?: string
}

/**
 * @deprecated
 */
export interface UserProfileAccountSettingsNotificationSettings {
  todo?: string
}

export interface UserProfilePreference {
  id?: string
  applicationId?: string
  name?: string
  description?: string
  value?: string
}

/**
 * @deprecated
 */
export interface UserProfileAccountSettingsPrivacySettings {
  hideMyProfile?: string
}
export interface UserProfileAccountSettingsLayoutAndThemeSettings {
  menuMode?: 'HORIZONTAL' | 'STATIC' | 'OVERLAY' | 'SLIM' | 'SLIMPLUS'
  colorScheme?: 'AUTO' | 'LIGHT' | 'DARK'
}
export interface Membership {
  application?: string
  roleMemberships?: Array<MembershipRoles>
}
export interface PersonDTO {
  persisted?: boolean
  id?: string
  version?: number
  firstName?: string
  lastName?: string
  email?: string
  jobPosition?: string
  groupId?: string
}

export interface MembershipRoles {
  role?: string
  permissions?: Array<Permission>
}

export interface AvatarInfo {
  userUploaded?: boolean
  lastUpdateTime?: Date
  imageUrl?: string
  smallImageUrl?: string
}

export interface Permission {
  resource?: string
  action?: string
  key?: string
  name?: string
}

export interface UserPerson {
  firstName?: string
  lastName?: string
  displayName?: string
  email?: string
  address?: UserPersonAddress
  phone?: UserPersonPhone
}

export interface UserPersonAddress {
  street?: string
  streetNo?: string
  city?: string
  postalCode?: string
  country?: string
}

export interface UserPersonPhone {
  type?: PhoneType
  number?: string
}

export enum PhoneType {
  MOBILE = 'MOBILE',
  LANDLINE = 'LANDLINE',
}
