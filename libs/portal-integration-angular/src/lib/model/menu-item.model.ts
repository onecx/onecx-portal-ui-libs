export interface PortalMenuItem {
  id: string
  version: number
  key: string
  name: string
  i18n: {
    [key: string]: string
  }
  url: string
  portalId: string
  disabled: boolean
  position: number
  children: Array<PortalMenuItem>
  permissionObject: string
  badge: string
  scope: string
  applicationId: string
  portalExit: boolean
  parentKey?: string
}
