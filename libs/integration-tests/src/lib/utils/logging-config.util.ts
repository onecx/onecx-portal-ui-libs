import { PlatformConfig } from '../model/platform-config.interface'

/**
 * Utility function to determine if logging should be enabled based on platform configuration
 * @param config Platform configuration object
 * @returns boolean indicating whether logging should be enabled
 */
export function loggingEnabled(config: PlatformConfig): boolean {
  if (typeof config.enableLogging === 'boolean') {
    return config.enableLogging
  } else {
    return false
  }
}
