import { Tree } from '@nx/devkit'

import { replaceTranslationUtilsImports } from './utils/replace-translation-utils-imports'
import { updateTranslationsForRemoteComponent } from './utils/update-translation-utils-for-remote-component'
import { updateTranslationsForMfe } from './utils/update-translation-utils-for-mfe'

export default async function replaceTranslationsUtils(tree: Tree) {
  const srcDirectoryPath = 'src'

  replaceTranslationUtilsImports(tree, srcDirectoryPath)

  updateTranslationsForRemoteComponent(tree, srcDirectoryPath)
  updateTranslationsForMfe(tree, srcDirectoryPath)
}
