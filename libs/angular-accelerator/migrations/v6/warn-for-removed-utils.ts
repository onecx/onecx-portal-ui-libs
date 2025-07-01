import { Tree } from '@nx/devkit'
import { detectFunctionCallsInFiles, isImportSpecifierInContent, printWarnings } from '@onecx/nx-migration-utils'

export default async function warnForRemovedUtils(tree: Tree) {
  const srcDirectoryPath = 'src'
  warnForIsValidDate(tree, srcDirectoryPath)
}

function warnForIsValidDate(tree: Tree, srcDirectoryPath: string) {
  const functionName = 'isValidDate'
  const warningIsValidDate =
    '⚠️ isValidDate is no longer available. Please adapt the usages with your own implementation.'
  const detectedFunctionCalls = detectFunctionCallsInFiles(tree, srcDirectoryPath, functionName)

  const affectedFiles = Array.from(detectedFunctionCalls.keys()).filter((filePath) => {
    const content = tree.read(filePath, 'utf-8')
    return content && isImportSpecifierInContent(content, '@onecx/angular-accelerator', functionName)
  })

  printWarnings(warningIsValidDate, affectedFiles)
}
