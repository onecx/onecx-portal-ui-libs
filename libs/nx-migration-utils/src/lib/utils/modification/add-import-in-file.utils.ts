import { isImportInContent } from '../validation/is-import-in-content.utils'
import { isNamespaceImportInContent } from '../validation/is-namespace-import-in-content.utils'
import { addNewImport } from './add-new-import.utils'
import { addToFirstImport } from './add-to-first-import.utils'

/**
 * Add the import with specifiers in the file.
 * @param fileContent - the path to a file to modify
 * @param specifiers - import specifiers to add
 * @param path - import path
 * @returns {string} modified content of the file with provider imported
 */
export function addImportInFile(fileContent: string, specifiers: string[], path: string): string {
  if (isNamespaceImportInContent(fileContent, path)) {
    return fileContent
  } else if (isImportInContent(fileContent, path)) {
    return addToFirstImport(fileContent, path, specifiers)
  } else {
    return addNewImport(fileContent, path, specifiers)
  }
}
