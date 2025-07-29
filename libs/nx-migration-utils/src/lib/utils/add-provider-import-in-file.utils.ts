import { addNewImport } from './add-new-import.utils'
import { addToFirstImport } from './add-to-first-import.utils'
import { isImportInContent } from './is-import-in-content.utils'
import { isNamespaceImportInContent } from './is-namespace-import-in-content.utils'
import { Provider } from './../angular/model/provider.model'

/**
 * Add the import for Angular provider in the file.
 * @param fileContent - the path to a file to modify
 * @param provider - angular provider to add
 * @returns {string} modified content of the file with provider imported
 */
export function addProviderImportInFile(fileContent: string, provider: Provider): string {
  if (isNamespaceImportInContent(fileContent, provider.importPath)) {
    return fileContent
  } else if (isImportInContent(fileContent, provider.importPath)) {
    return addToFirstImport(fileContent, provider.importPath, provider.name)
  } else {
    return addNewImport(fileContent, provider.importPath, [provider.name])
  }
}
