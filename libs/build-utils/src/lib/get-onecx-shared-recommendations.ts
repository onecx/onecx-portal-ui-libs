export interface SharedLibraryConfig {
  singleton?: boolean
  strictVersion?: boolean
  eager?: boolean
  requiredVersion?: string | false
  version?: string
  includeSecondaries?: boolean
  shareScope?: string
}

/**
 * Patterns for identifying shared libraries that should have specific configuration recommendations.
 */
const sharedLibraryPatterns: RegExp[] = [
  /^@angular.*$/,
  /^@onecx.*$/,
  /^rxjs.*$/,
  /^primeng.*$/,
  /^@ngx-translate.*$/,
  /^@ngrx.*$/,
]

/**
 * Provides recommendations for shared library configurations for specific OneCX-related libraries.
 * If the library name matches certain patterns (e.g., Angular, OneCX, RxJS, PrimeNG, ngx-translate, ngrx), it modifies the shared configuration to set singleton, strictVersion, and eager to false.
 * For non-matching libraries, it returns false and does not modify the configuration.
 * @param {string} libraryName - The name of the library being shared.
 * @param {SharedLibraryConfig} sharedConfig - The existing shared configuration for the library, which may be modified if recommendations are applied.
 * @returns {false | SharedLibraryConfig} - Returns the modified shared configuration if recommendations are applied, or false if no recommendations are applicable.
 */
export function getOneCXSharedRecommendations(
  libraryName: string,
  sharedConfig: SharedLibraryConfig
): false | SharedLibraryConfig {
  if (!sharedLibraryPatterns.some((pattern) => pattern.test(libraryName))) {
    return false
  }
  sharedConfig.singleton = false
  sharedConfig.strictVersion = false
  sharedConfig.eager = false
  return sharedConfig
}
