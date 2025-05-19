import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { replace } from '@phenomnomnominal/tsquery'
import { ScriptKind } from 'typescript'
import { removeEmptySlotsFromArrays } from '../utils/typescript-files.utils'

/**
 * Applies a tsquery-based replacement to a single TypeScript file.
 *
 * @param tree - The Nx virtual file system tree.
 * @param filePath - Path to the TypeScript file to update.
 * @param queryStr - A tsquery selector string used to identify nodes for replacement.
 * @param replacement - The replacement string. If empty, trailing commas and empty array slots are cleaned up.
 */
export function replaceInFile(tree: Tree, filePath: string, queryStr: string, replacement: string) {
  try {
    const fileContent = tree.read(filePath, 'utf-8')
    if (!fileContent) return

    let updatedContent = replace(fileContent, queryStr, () => replacement, ScriptKind.TS)
    if (replacement === '') {
      updatedContent = removeEmptySlotsFromArrays(updatedContent)
    }

    if (updatedContent !== fileContent) {
      tree.write(filePath, updatedContent)
    }
  } catch (error) {
    console.error(`Error doing replacement for file ${filePath}: `, error)
  }
}

/**
 * Applies a tsquery-based replacement to all `.ts` files in a given directory.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Path to the directory containing TypeScript files.
 * @param queryStr - A tsquery selector string used to identify nodes for replacement.
 * @param replacement - The replacement string. If empty, trailing commas and empty array slots are cleaned up.
 */
export function replaceInFiles(tree: Tree, directoryPath: string, queryStr: string, replacement: string) {
  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (!filePath.endsWith('.ts')) return
    replaceInFile(tree, filePath, queryStr, replacement)
  })
}
