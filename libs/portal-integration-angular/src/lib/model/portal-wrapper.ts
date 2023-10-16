import { Portal } from './portal'
import { PortalMenuItem } from './menu-item.model'
import { MicroFrontend } from './microfrontend'
import { Theme } from './theme'

export interface PortalWrapper {
  portalDTO: Portal
  menuItemList: PortalMenuItem[]
  microfrontends: MicroFrontend[]
  theme: Theme
}
