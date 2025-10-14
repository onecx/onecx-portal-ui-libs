import { PlatformConfig } from '../models/platform-config.interface'

/**
 * Utility function to determine if logging should be enabled based on platform configuration
 * @param config Platform configuration object
 * @param networkAliases Optional array of network aliases for the container. If provided, selective logging is applied.
 * @returns boolean indicating whether logging should be enabled
 */
export function loggingEnabled(config: PlatformConfig, networkAliases?: string[]): boolean {
  if (typeof config.enableLogging === 'boolean') {
    return config.enableLogging
  } else if (Array.isArray(config.enableLogging)) {
    // If no networkAliases provided, just check if there are any items in the array
    if (!networkAliases || networkAliases.length === 0) {
      return config.enableLogging.length > 0
    }

    // Separate positive and negative (with !) entries
    const positiveEntries = config.enableLogging.filter((entry) => !entry.startsWith('!'))
    const negativeEntries = config.enableLogging
      .filter((entry) => entry.startsWith('!'))
      .map((entry) => entry.substring(1)) // Remove the '!' prefix

    // If there are negative entries, check if any of the container's aliases are excluded
    if (negativeEntries.length > 0) {
      const isExcluded = networkAliases.some((alias) => negativeEntries.includes(alias))
      if (isExcluded) {
        return false // Explicitly excluded
      }
      // If there are only negative entries (no positive ones), enable logging by default
      if (positiveEntries.length === 0) {
        return true // Enable all except excluded ones
      }
    }

    // Check if any of the container's network aliases are in the positive list
    return networkAliases.some((alias) => positiveEntries.includes(alias))
  } else {
    return false
  }
}
