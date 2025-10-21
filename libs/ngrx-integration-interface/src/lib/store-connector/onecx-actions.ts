import { createActionGroup, props } from '@ngrx/store'
import { MfeInfo, PageInfo, Theme, UserProfile, Workspace } from '@onecx/integration-interface'

export const OneCxActions = createActionGroup({
  source: 'OneCX',
  events: {
    navigated: props<{
      event: undefined | unknown
    }>(),
    permissionsChanged: props<{
      permissions: string[]
    }>(),
    configChanged: props<{
      config: { [key: string]: string }
    }>(),
    currentMfeChanged: props<{
      currentMfe: MfeInfo
    }>(),
    currentPageChanged: props<{
      currentPage: PageInfo | undefined
    }>(),
    currentThemeChanged: props<{
      currentTheme: Theme
    }>(),
    currentWorkspaceChanged: props<{
      currentWorkspace: Workspace
    }>(),
    appConfigChanged: props<{
      appConfig: { [key: string]: string }
    }>(),
    userProfileChanged: props<{
      userProfile: UserProfile
    }>(),
  },
})
