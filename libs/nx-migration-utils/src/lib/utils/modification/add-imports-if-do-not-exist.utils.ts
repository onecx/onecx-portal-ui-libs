import { Tree } from '@nx/devkit'
import { addImportInFile } from './add-import-in-file.utils'

/**
 * Modify the file content so the imports exists if they were not present already.
 * @param tree - the file tree used for file content reading
 * @param filePath - the path to a file to validate and update
 * @param imports - list of imports with specifiers and path
 */
export function addImportsIfDoNotExist(
  tree: Tree,
  filePath: string,
  imports: Array<{ specifiers: Array<string>; path: string }>
) {
  const fileContent = tree.read(filePath, 'utf-8')
  if (!fileContent) return

  let updatedFileContent = fileContent
  for (const imp of imports) {
    updatedFileContent = addImportInFile(updatedFileContent, imp.specifiers, imp.path)
  }

  if (fileContent !== updatedFileContent) {
    tree.write(filePath, updatedFileContent)
  }
}
