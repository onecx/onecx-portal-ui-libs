import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { commonMigrateOnecxToV6, hasHtmlTag, printWarnings } from '@onecx/nx-migration-utils'

export default async function migrateOnecxToV6(tree: Tree) {
  await commonMigrateOnecxToV6(tree)
  warnOcxPortalViewport(tree, 'src')
}

function warnOcxPortalViewport(tree: Tree, directoryPath: string) {
  const foundInFiles: string[] = []
  const warning =
    '⚠️ ocx-portal-viewport was removed. Please refer to the standalone guide for adaptations: https://onecx.github.io/docs/guides/current/angular/cookbook/migrations/enable-standalone/index.html'

  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (hasHtmlTag(tree, filePath, 'ocx-portal-viewport')) {
      foundInFiles.push(filePath)
      printWarnings(warning, foundInFiles)
    }
  })
}
