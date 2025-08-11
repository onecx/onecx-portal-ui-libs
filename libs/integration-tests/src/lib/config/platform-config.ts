import { PlatformConfig } from '../model/platform-config.interface'

// TypeScript configurations (will be migrated to JSON)
/** Complete platform configuration with all services enabled */
export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  startDefaultSetup: true,
  importData: true,
  enableLogging: true,
}
