import { Tree } from '@nx/devkit'
import { printWarnings, detectMethodCallsInFiles } from '@onecx/nx-migration-utils'

const THEME_SERVICE_REMOVED_PROPERTY = 'baseUrlV1'
const THEME_SERVICE_REMOVED_METHODS = ['getThemeRef', 'loadAndApplyTheme', 'apply'] as const

export function warnThemeServiceRemovedProperties(tree: Tree, srcDirectoryPath: string) {
  const allDetectedPropertyFiles = new Set<string>()

  const detectedPropertyInFiles = detectMethodCallsInFiles(
    tree,
    srcDirectoryPath,
    THEME_SERVICE_REMOVED_PROPERTY,
    'ThemeService'
  )
  detectedPropertyInFiles.forEach((_, filePath) => {
    allDetectedPropertyFiles.add(filePath)
  })

  if (allDetectedPropertyFiles.size > 0) {
    const warningPropertyCalls = `ThemeService property ${THEME_SERVICE_REMOVED_PROPERTY} have been removed in v6. Please remove these usages and adapt your code accordingly.`
    printWarnings(warningPropertyCalls, Array.from(allDetectedPropertyFiles))
  }
}

export function warnThemeServiceRemovedMethods(tree: Tree, srcDirectoryPath: string) {
  const allDetectedMethodFiles = new Set<string>()

  THEME_SERVICE_REMOVED_METHODS.forEach((method) => {
    const detectedMethodCalls = detectMethodCallsInFiles(tree, srcDirectoryPath, method, 'ThemeService')
    detectedMethodCalls.forEach((_, filePath) => {
      allDetectedMethodFiles.add(filePath)
    })
  })

  if (allDetectedMethodFiles.size > 0) {
    const warningMethodCalls = `ThemeService methods [${THEME_SERVICE_REMOVED_METHODS.join(', ')}] have been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly.`
    printWarnings(warningMethodCalls, Array.from(allDetectedMethodFiles))
  }
}
