import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { printWarnings } from '../../utils/print-warnings.utils'
import { updateJsonFile } from './update-json-file.utils'

export function updateJsonFiles(
  tree: Tree,
  dirPath: string,
  updater: (json: any) => string,
  options?: { warn: boolean; warning: string; contentCondition: string }
) {
  const foundInFiles: string[] = []

  visitNotIgnoredFiles(tree, dirPath, (file) => {
    if (file.endsWith('.json')) {
      options && file.includes(options.contentCondition) && foundInFiles.push(file)
      updateJsonFile(tree, file, updater)
    }
  })

  options?.warn && printWarnings(options.warning, foundInFiles)
}
