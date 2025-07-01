import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { hasHtmlTag, isImportSpecifierInContent, printWarnings } from '@onecx/nx-migration-utils'

export default async function warnForRemovedComponents(tree: Tree) {
  const srcDirectoryPath = 'src'
  warnForDataLoadingError(tree, srcDirectoryPath)
}

function warnForDataLoadingError(tree: Tree, srcDirectoryPath: string) {
  const htmlTag = 'ocx-data-loading-error'
  const componentClass = 'DataLoadingErrorComponent'
  const warningDataLoadingError =
    '⚠️ DataLoadingErrorComponent (ocx-data-loading-error) is no longer available. Please adapt the usages with your own implementation.'

  const affectedFiles: Array<string> = []

  visitNotIgnoredFiles(tree, srcDirectoryPath, (filePath) => {
    const content = tree.read(filePath, 'utf-8')
    if (!content) return
    if (filePath.endsWith('.html') && hasHtmlTag(tree, content, htmlTag)) {
      affectedFiles.push(filePath)
    } else if (
      filePath.endsWith('.ts') &&
      isImportSpecifierInContent(content, '@onecx/angular-accelerator', componentClass)
    ) {
      affectedFiles.push(filePath)
    }
  })

  printWarnings(warningDataLoadingError, affectedFiles)
}
