import { Tree } from '@nx/devkit'
import { printWarnings, detectMethodCallsInFiles, detectPropertyAccessInFiles } from '@onecx/nx-migration-utils'

const THEME_SERVICE_REMOVED_PROPERTIES = ['baseUrlV1'] as const
const THEME_SERVICE_REMOVED_METHODS = ['getThemeRef', 'loadAndApplyTheme', 'apply'] as const

function warnThemeServiceRemovedProperties(tree: Tree, srcDirectoryPath: string) {
  const allDetectedPropertyFiles = new Set<string>()

  THEME_SERVICE_REMOVED_PROPERTIES.forEach((property) => {
    const detectedPropertyAccess = detectPropertyAccessInFiles(tree, srcDirectoryPath, property, 'ThemeService')
    detectedPropertyAccess.forEach((_, filePath) => {
      allDetectedPropertyFiles.add(filePath)
    })
  })

  if (allDetectedPropertyFiles.size > 0) {
    const warningPropertyCalls = `⚠️ ThemeService properties [${THEME_SERVICE_REMOVED_PROPERTIES.join(', ')}] have been removed in v6. Please remove these usages and adapt your code accordingly.`
    printWarnings(warningPropertyCalls, Array.from(allDetectedPropertyFiles))
  }
}

function warnThemeServiceRemovedMethods(tree: Tree, srcDirectoryPath: string) {
  const allDetectedMethodFiles = new Set<string>()

  THEME_SERVICE_REMOVED_METHODS.forEach((method) => {
    const detectedMethodCalls = detectMethodCallsInFiles(tree, srcDirectoryPath, method, 'ThemeService')
    detectedMethodCalls.forEach((_, filePath) => {
      allDetectedMethodFiles.add(filePath)
    })
  })

  if (allDetectedMethodFiles.size > 0) {
    const warningMethodCalls = `⚠️ ThemeService methods [${THEME_SERVICE_REMOVED_METHODS.join(', ')}] have been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly.`
    printWarnings(warningMethodCalls, Array.from(allDetectedMethodFiles))
  }
}

export default async function warnRemovePropertiesFromThemeService(tree: Tree) {
  warnThemeServiceRemovedProperties(tree, 'src')
  warnThemeServiceRemovedMethods(tree, 'src')
}
