import { Tree } from '@nx/devkit'
import postcss from 'postcss'
import * as postcssScss from 'postcss-scss'
/**
 * Updates a stylesheet file using a provided PostCSS-based updater function.
 * Only writes changes if the updated content differs from the original.
 *
 * @param tree - The Nx Tree (virtual file system).
 * @param filePath - The path to the stylesheet file (e.g., .css, .scss).
 * @param updater - A function that receives the parsed PostCSS root and returns the updated stylesheet as a string.
 */
export function updateStyleSheet(tree: Tree, filePath: string, updater: (styleSheetContent: postcss.Root) => string) {
  const content = tree.read(filePath, 'utf-8')
  if (!content) return

  const root = filePath.endsWith('.scss') ? postcssScss.parse(content) : postcss.parse(content)

  const updatedContent = updater(root)

  if (updatedContent !== content) {
    tree.write(filePath, updatedContent)
  }
}
