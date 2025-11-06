import { MfeInfo, NavigatedEventPayload, PageInfo, Theme, UserProfile, Workspace } from '@onecx/integration-interface'

export type LocationState = NavigatedEventPayload
export interface OneCxState {
  location?: LocationState | undefined
  permissions?: string[] | undefined
  config?: { [key: string]: string } | undefined
  currentMfe?: MfeInfo
  currentPage?: PageInfo | undefined
  currentTheme?: Theme
  currentWorkspace?: Workspace
  appConfig?: { [key: string]: string }
  userProfile?: UserProfile
}
