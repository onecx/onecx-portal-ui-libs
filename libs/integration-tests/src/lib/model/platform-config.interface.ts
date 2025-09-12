import { BffContainerInterface } from './bff.interface'
import { SvcContainerInterface } from './svc.interface'
import { UiContainerInterface } from './ui.interface'
import { HeartbeatConfig } from './health-checker.interface'

export interface PlatformConfig {
  /** Whether to run data import after starting services */
  importData?: boolean
  /** Whether to enable logging or not */
  enableLogging?: boolean | string[]
  /**  */
  hearthbeat?: HeartbeatConfig
  /** Image overrides - allows testing against different images */
  platformOverrides?: {
    /** Core service images */
    core?: {
      postgres?: { image?: string }
      keycloak?: { image?: string }
      importmanager?: { image?: string }
    }
    /** Backend service images */
    services?: {
      iamKc?: { image?: string }
      workspace?: { image?: string }
      userProfile?: { image?: string }
      theme?: { image?: string }
      tenant?: { image?: string }
      productStore?: { image?: string }
      permission?: { image?: string }
    }
    /** BFF shell service images */
    bff?: {
      shell?: { image?: string }
    }
    /** UI shell service images */
    ui?: {
      shell?: { image?: string }
    }
  }
  container?: {
    service?: SvcContainerInterface[]
    bff?: BffContainerInterface[]
    ui?: UiContainerInterface[]
  }
}
