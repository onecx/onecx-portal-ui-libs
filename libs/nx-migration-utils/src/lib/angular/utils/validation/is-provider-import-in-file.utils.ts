import { ast, query } from '@phenomnomnominal/tsquery'
import { Provider } from '../../model/provider.model'
import { providerImportPattern } from '../patterns.utils'
import { importNamespacePattern } from '../../../utils/patterns.utils'
import { ImportDeclaration } from 'typescript'

/**
 * Checks if file imports the Angular provider
 * @param fileContent - the path to a file to check
 * @param provider - angular provider to check
 * @returns {boolean} if the Angular provider is imported in file
 */
export function isProviderImportInFile(fileContent: string, provider: Provider): boolean {
  const contentAst = ast(fileContent)

  const allPatterns = [providerImportPattern(provider), importNamespacePattern(provider.importPath)].join(', ')
  const providerImports = query<ImportDeclaration>(contentAst, allPatterns)

  return providerImports.length > 0
}
