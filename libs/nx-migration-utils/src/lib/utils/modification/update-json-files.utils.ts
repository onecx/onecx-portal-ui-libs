import { Tree, updateJson, visitNotIgnoredFiles } from '@nx/devkit'
import { printWarnings } from '../../utils/print-warnings.utils'

/**
 * Updates all JSON files within a specified directory using a provided updater function.
 * Optionally logs warnings if certain content conditions are met.
 *
 * @param tree - The Nx Tree (virtual file system).
 * @param dirPath - The directory path to search for JSON files.
 * @param updater - A function that receives the parsed JSON and returns the updated object.
 * @param options - Optional settings:
 *  - warn: Whether to print warnings.
 *  - warning: The warning message to display.
 *  - contentCondition: A string to match in file paths for triggering warnings.
 */
export function updateJsonFiles(
  tree: Tree,
  dirPath: string,
  updater: (json: any) => object,
  options?: { warn: boolean; warning: string; contentCondition: string }
) {
  const foundInFiles: string[] = []

  visitNotIgnoredFiles(tree, dirPath, (file) => {
    if (file.endsWith('.json')) {
      if (options && file.includes(options.contentCondition)) {
        foundInFiles.push(file)
      }
      updateJson(tree, file, updater)
    }
  })

  if (options?.warn) {
    printWarnings(options.warning, foundInFiles)
  }
}
