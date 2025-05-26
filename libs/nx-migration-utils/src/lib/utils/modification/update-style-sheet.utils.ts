import { Tree } from '@nx/devkit'
import postcss from 'postcss'

export function updateStyleSheet(tree: Tree, filePath: string, updater: (styleSheetContent: postcss.Root) => string) {
  const content = tree.read(filePath, 'utf-8')
  if (!content) return

  const root = postcss.parse(content)

  const updatedContent = updater(root)

  if (updatedContent !== content) {
    tree.write(filePath, updatedContent)
  }
}
