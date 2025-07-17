import { ast, query } from '@phenomnomnominal/tsquery'
import { ClassDeclaration } from 'typescript'
import { MatchingModule } from '../../model/matching-module.model'
import { Provider } from '../../model/provider.model'
import { moduleProviderIdentifierPattern } from '../patterns.utils'

/**
 * Checks if the Angular module include the provider in the providers list.
 * @param fileContent - the content of the file the module is used in
 * @param module - the module to check
 * @param provider - the provider to check
 * @param variablesWithProvider - the list of variable names containing the provider to check
 * @returns {boolean} if the module includes the provider
 */
export function isProviderInModule(
  fileContent: string,
  module: MatchingModule,
  provider: Provider,
  variablesWithProvider: string[]
): boolean {
  const contentAst = ast(fileContent)

  const directProviderPattern = moduleProviderIdentifierPattern(module.name, provider.name)
  const provideViaVariablePatterns = variablesWithProvider.map((name) =>
    moduleProviderIdentifierPattern(module.name, name)
  )
  const allPatterns = [...provideViaVariablePatterns, directProviderPattern].join(', ')
  const modulesWithProvider = query<ClassDeclaration>(contentAst, allPatterns)

  return modulesWithProvider.length > 0
}
