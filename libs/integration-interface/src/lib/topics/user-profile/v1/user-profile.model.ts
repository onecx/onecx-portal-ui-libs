export interface UserProfile {
  id?: string
  userId: string
  identityProvider?: string
  /**
   * user id in external identity provider, e.g. in keycloak
   */
  identityProviderId?: string
  organization?: string
  tenantId?: string
  tenantName?: string
  person: UserPerson
  avatar?: AvatarInfo
  accountSettings?: UserProfileAccountSettings
  roles?: Array<string>
  memberships?: Array<Membership>
  idToken?: string
  accessToken?: string
}

export interface UserProfileAccountSettings {
  privacySettings?: UserProfileAccountSettingsPrivacySettings
  notificationSettings?: UserProfileAccountSettingsNotificationSettings
  localeAndTimeSettings?: UserProfileAccountSettingsLocaleAndTimeSettings
  layoutAndThemeSettings?: UserProfileAccountSettingsLayoutAndThemeSettings
}

export interface UserProfileAccountSettingsLocaleAndTimeSettings {
  locale?: string
  timezone?: string
}

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
