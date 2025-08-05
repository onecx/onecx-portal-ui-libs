import { BffContainerInterface } from './bff.interface'
import { SvcContainerInterface } from './svc.interface'
import { UiContainerInterface } from './ui.interface'

export interface PlatformConfig {
  /** Core services that are always required */
  core: {
    postgres: boolean
    keycloak: boolean
  }
  /** Backend services */
  services?: {
    iamKc?: boolean
    workspace?: boolean
    userProfile?: boolean
    theme?: boolean
    tenant?: boolean
    productStore?: boolean
    permission?: boolean
  }
  /** Backend for frontend services */
  bff?: {
    shell?: boolean
  }
  /** UI services */
  ui?: {
    shell?: boolean
  }
  /** Whether to run data import after starting services */
  importData?: boolean
  /** Whether to enable loggin or not */
  enableLogging?: boolean
  /** Image version overrides - allows testing against different versions */
  imageVersions?: {
    /** Core service versions */
    core?: {
      postgres?: string
      keycloak?: string
      node?: string
    }
    /** Backend service versions */
    services?: {
      iamKc?: string
      workspace?: string
      userProfile?: string
      theme?: string
      tenant?: string
      productStore?: string
      permission?: string
    }
    /** Shell service versions */
    shell?: {
      bff?: string
      ui?: string
    }
  }
  container?: {
    service?: SvcContainerInterface | SvcContainerInterface[]
    bff?: BffContainerInterface | BffContainerInterface[]
    ui?: UiContainerInterface | UiContainerInterface[]
  }
}
