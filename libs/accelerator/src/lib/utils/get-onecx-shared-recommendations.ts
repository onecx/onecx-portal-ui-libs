export interface SharedLibraryConfig {
  singleton?: boolean
  strictVersion?: boolean
  eager?: boolean
  requiredVersion?: string | false
  version?: string
  includeSecondaries?: boolean
}

const sharedLibraryPatterns: RegExp[] = [
  /^@angular.*$/,
  /^@onecx.*$/,
  /^rxjs.*$/,
  /^primeng.*$/,
  /^@ngx-translate.*$/,
  /^@ngrx.*$/,
]

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
