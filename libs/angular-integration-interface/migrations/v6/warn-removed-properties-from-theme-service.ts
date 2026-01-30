import { Tree } from '@nx/devkit'
import { printWarnings, detectMethodCallsInFiles } from '@onecx/nx-migration-utils'

const THEME_SERVICE_REMOVED_PROPERTY = 'baseUrlV1'
const THEME_SERVICE_REMOVED_METHODS = ['getThemeRef', 'loadAndApplyTheme', 'apply']

export function warnThemeServiceRemovedProperties(tree: Tree, srcDirectoryPath: string) {
  const detectedPropertyInFiles = detectMethodCallsInFiles(
    tree,
    srcDirectoryPath,
    THEME_SERVICE_REMOVED_PROPERTY,
    'ThemeService'
  )

  if (detectedPropertyInFiles.size > 0) {
    const warningPropertyCalls = `ThemeService property ${THEME_SERVICE_REMOVED_PROPERTY} have been removed in v6. Please remove these usages and adapt your code accordingly.`
    printWarnings(warningPropertyCalls, Array.from(detectedPropertyInFiles.keys()))
  }
}

export function warnThemeServiceRemovedMethods(tree: Tree, srcDirectoryPath: string) {
  THEME_SERVICE_REMOVED_METHODS.forEach((method) => {
    const detectedMethodCalls = detectMethodCallsInFiles(tree, srcDirectoryPath, method, 'ThemeService')
    if (detectedMethodCalls.size > 0) {
      const warningMethodCall = `ThemeService method '${method}' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly.`
      printWarnings(warningMethodCall, Array.from(detectedMethodCalls.keys()))
    }
  })
}
