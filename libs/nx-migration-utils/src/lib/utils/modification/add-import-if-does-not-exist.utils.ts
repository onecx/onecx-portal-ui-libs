import { Tree } from '@nx/devkit'
import { isImportSpecifierInContent } from '../validation/is-import-specifier-in-file-content.utils'
import { addImportInFile } from './add-import-in-file.utils'
import { isFilePath } from '../typescript-files.utils'

/**
 * Modify the file content so the import exists if it was not present already.
 * @param tree - the file tree used for file content reading
 * @param input - the content or path to a file to validate and update
 * @param specifier - specifier to add
 * @param path - import path
 */
export function addImportIfDoesNotExist(tree: Tree, input: string, specifier: string, path: string) {
  const isInputFilePath = isFilePath(input)
  const fileContent = isInputFilePath ? tree.read(input, 'utf-8') : input
  if (!fileContent) {
    throw new Error(`File content is empty or file does not exist: ${input}`)
  }

  let updatedFileContent = fileContent
  if (!isImportSpecifierInContent(updatedFileContent, path, specifier)) {
    updatedFileContent = addImportInFile(updatedFileContent, [specifier], path)
  }

  if (fileContent !== updatedFileContent && isInputFilePath) {
    tree.write(input, updatedFileContent)
  }

  return updatedFileContent
}
