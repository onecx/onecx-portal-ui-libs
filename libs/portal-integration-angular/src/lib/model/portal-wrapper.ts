import { Theme } from '@onecx/angular-integration-interface'
import { Portal } from './portal'
import { PortalMenuItem } from './menu-item.model'
import { MicroFrontend } from './microfrontend'

export interface PortalWrapper {
  portalDTO: Portal
  menuItemList: PortalMenuItem[]
  microfrontends: MicroFrontend[]
  theme: Theme
}
