import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { printWarnings } from '../print-warnings.utils'
import { isStyleSheet } from '../validation/is-file-style-sheet.utils'
import { updateStyleSheet } from './update-style-sheet.utils'
import postcss from 'postcss'

export function updateStyleSheets(
  tree: Tree,
  dirPath: string,
  updater: (styleSheetContent: postcss.Root) => string,
  options?: { warn: boolean; warning: string; contentCondition: string }
) {
  const foundInFiles: string[] = []

  visitNotIgnoredFiles(tree, dirPath, (file) => {
    if (isStyleSheet(file)) {
      options && file.includes(options.contentCondition) && foundInFiles.push(file)
      updateStyleSheet(tree, file, updater)
    }
  })

  options?.warn && printWarnings(options.warning, foundInFiles)
}
