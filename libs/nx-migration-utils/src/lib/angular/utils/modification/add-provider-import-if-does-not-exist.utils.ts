import { Tree } from '@nx/devkit'
import { Provider } from '../../model/provider.model'
import { isProviderImportInFile } from '../validation/is-provider-import-in-file.utils'
import { addProviderImportInFile } from './add-provider-import-in-file.utils'

/**
 * Modify the file content so the import for Angular provider exists if it was not present already.
 * @param tree - the file tree used for file content reading
 * @param filePath - the path to a file to validate and update
 * @param provider - angular provider to import
 */
export function addProviderImportIfDoesNotExist(tree: Tree, filePath: string, provider: Provider) {
  const fileContent = tree.read(filePath, 'utf-8')
  if (!fileContent) return

  let updatedFileContent = fileContent

  if (!isProviderImportInFile(updatedFileContent, provider)) {
    updatedFileContent = addProviderImportInFile(updatedFileContent, provider)
  }

  if (fileContent !== updatedFileContent) {
    tree.write(filePath, updatedFileContent)
  }
}
