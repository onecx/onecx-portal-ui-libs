import { SharedLibraryConfig, SharedFunction } from '@nx/module-federation'

const sharedLibraryPatterns: RegExp[] = [
  /^@angular.*$/,
  /^@onecx.*$/,
  /^rxjs.*$/,
  /^primeng.*$/,
  /^@ngx-translate.*$/
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
