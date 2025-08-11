import { CustomBffContainerInterface } from './bff.interface'
import { CustomSvcContainerInterface } from './svc.interface'
import { CustomUiContainerInterface } from './ui.interface'

export interface PlatformConfig {
  /** Whether to run the minimal setup of the onecx Platform */
  startDefaultSetup?: boolean
  /** Whether to run data import after starting services */
  importData?: boolean
  /** Whether to enable loggin or not */
  enableLogging?: boolean
  /** Image overrides - allows testing against different images */
  imageOverrides?: {
    /** Core service images */
    core?: {
      postgres?: string
      keycloak?: string
      importmanager?: string
    }
    /** Backend service images */
    services?: {
      iamKc?: string
      workspace?: string
      userProfile?: string
      theme?: string
      tenant?: string
      productStore?: string
      permission?: string
    }
    /** BFF shell service images */
    bff?: {
      shell?: string
    }
    /** UI shell service images */
    ui?: {
      shell?: string
    }
  }
  container?: {
    service?: CustomSvcContainerInterface | CustomSvcContainerInterface[]
    bff?: CustomBffContainerInterface | CustomBffContainerInterface[]
    ui?: CustomUiContainerInterface | CustomUiContainerInterface[]
  }
}
