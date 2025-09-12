import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { printWarnings } from '../print-warnings.utils'
import { isStyleSheet } from '../validation/is-file-style-sheet.utils'
import { updateStyleSheet } from './update-style-sheet.utils'
import postcss from 'postcss'

/**
 * Updates all stylesheet files within a specified directory using a PostCSS-based updater function.
 * Only processes files that are identified as stylesheets (e.g., .css, .scss).
 * Optionally logs warnings if certain content conditions are met.
 *
 * @param tree - The Nx Tree (virtual file system).
 * @param dirPath - The directory path to search for stylesheet files.
 * @param updater - A function that receives the parsed PostCSS root and returns the updated stylesheet as a string.
 * @param options - Optional settings:
 *  - warn: Whether to print warnings.
 *  - warning: The warning message to display.
 *  - contentCondition: A string to match in file paths for triggering warnings.
 */
export function updateStyleSheets(
  tree: Tree,
  dirPath: string,
  updater: (styleSheetContent: postcss.Root) => string,
  options?: { warn: boolean; warning: string; contentCondition: string }
) {
  const foundInFiles: string[] = []

  visitNotIgnoredFiles(tree, dirPath, (file) => {
    if (isStyleSheet(file)) {
      if (options && file.includes(options.contentCondition)) {
        foundInFiles.push(file)
      }
      updateStyleSheet(tree, file, updater)
    }
  })

  if (options?.warn) {
    printWarnings(options.warning, foundInFiles)
  }
}
