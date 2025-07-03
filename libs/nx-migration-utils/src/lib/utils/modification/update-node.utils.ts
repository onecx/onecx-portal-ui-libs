import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { replace } from '@phenomnomnominal/tsquery'
import { ScriptKind } from 'typescript'
import { fileMatchesQuery } from '../typescript-files.utils'

export function updateNode<T>(
  tree: Tree,
  rootDir: string,
  selector: string,
  updater: (node: T, filePath: string) => string,
  filterQuery?: string
) {
  visitNotIgnoredFiles(tree, rootDir, (file) => {
    const content = tree.read(file, 'utf-8')
    if (!content) return

    if (filterQuery && !fileMatchesQuery(content, filterQuery)) {
      return
    }

    const newContent = replace(
      content,
      selector,
      (node) => {
        const nodeT = node as T
        return updater(nodeT, file)
      },
      ScriptKind.TS
    )

    if (content !== newContent) {
      tree.write(file, newContent)
    }
  })
}
