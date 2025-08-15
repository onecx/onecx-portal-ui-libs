import { CONTAINER } from '../model/container.enum'
import { PlatformConfig } from '../model/platform-config.interface'

/** Complete platform configuration with all services enabled */
export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  startDefaultSetup: true,
  importData: true,
  enableLogging: true,
}
