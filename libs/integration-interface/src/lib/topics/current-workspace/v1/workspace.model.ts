import { Route } from './route.model'

export interface Workspace {
  baseUrl: string
  workspaceName: string
  // TODO: Deprecate? Not published by Shell
  id?: string
  displayName?: string
  // TODO: Deprecate? Not published by Shell
  themeId?: string
  // TODO: Deprecate? Not published by Shell (data available - workspaceConfig - theme)
  themeName?: string
  // TODO: Deprecate? Not published by Shell
  footerLabel?: string
  homePage?: string
  // TODO: Deprecate? Not published by Shell (data available? - userProfile - organization)
  companyName?: string
  // TODO: Deprecate? Not published by Shell
  portalRoles?: string[]
  // TODO: Deprecate? Not published by Shell (data available - workspaceConfig - theme)
  logoUrl?: string
  // TODO: Deprecate? Not published by Shell
  logoSmallImageUrl?: string

  routes?: Array<Route>
}
