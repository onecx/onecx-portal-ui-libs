import { Tree } from '@nx/devkit'
import { isImportSpecifierInContent } from '../validation/is-import-specifier-in-file-content.utils'
import { addImportInFile } from './add-import-in-file.utils'

/**
 * Modify the file content so the import exists if it was not present already.
 * @param tree - the file tree used for file content reading
 * @param filePath - the path to a file to validate and update
 * @param specifier - specifier to add
 * @param path - import path
 */
export function addImportIfDoesNotExist(tree: Tree, filePath: string, specifier: string, path: string) {
  const fileContent = tree.read(filePath, 'utf-8')
  if (!fileContent) return

  let updatedFileContent = fileContent
  if (!isImportSpecifierInContent(updatedFileContent, path, specifier)) {
    updatedFileContent = addImportInFile(updatedFileContent, [specifier], path)
  }

  if (fileContent !== updatedFileContent) {
    tree.write(filePath, updatedFileContent)
  }
}
