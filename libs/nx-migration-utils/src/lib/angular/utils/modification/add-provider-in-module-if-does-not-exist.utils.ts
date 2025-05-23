import { Tree } from '@nx/devkit'
import { MatchingModule } from '../../model/matching-module.model'
import { Provider } from '../../model/provider.model'
import { isProviderInModule } from '../validation/is-provider-in-module.utils'
import { addProviderInModule } from './add-provider-in-module.utils'

/**
 * Modify content of the file with the given module so the import of Angular provider exists if it was not present already.
 * @param tree - the file tree used for file content reading
 * @param module - the module to modify
 * @param provider - the provider to include
 * @param variablesWithProvider - the list of variable names containing the provider to include
 */
export function addProviderInModuleIfDoesNotExist(
  tree: Tree,
  module: MatchingModule,
  provider: Provider,
  variablesWithProvider: string[]
) {
  const moduleFileConent = tree.read(module.filePath, 'utf-8')
  if (!moduleFileConent) return

  let updatedModuleFileContent = moduleFileConent

  if (!isProviderInModule(updatedModuleFileContent, module, provider, variablesWithProvider)) {
    updatedModuleFileContent = addProviderInModule(updatedModuleFileContent, module, provider)
  }

  if (moduleFileConent !== updatedModuleFileContent) {
    tree.write(module.filePath, updatedModuleFileContent)
  }
}
