import { Tree } from '@nx/devkit'
import { detectVariablesIncludingIdentifier } from '../../utils/detect-variable.utils'
import { Provider } from '../model/provider-info.model'
import { ast, query } from '@phenomnomnominal/tsquery'
import { ImportDeclaration } from 'typescript'
import {
  addToFirstImport,
  createNewImport,
  doesIncludeImport,
  doesIncludeNamespaceImport,
} from '../../utils/import.utils'
import { providerImportPattern } from './patterns.utils'
import { importNamespacePattern } from '../../utils/patterns.utils'

/**
 * Detects variables that include the Angular provider.
 * @param tree - the file tree to search in
 * @param rootDir - the directory to start searching from
 * @param provider - the provider to search for
 * @returns {string[]} a list of variable names that include the provider
 */
export function detectVariablesIncludingProvider(tree: Tree, rootDir: string, provider: Provider): string[] {
  return detectVariablesIncludingIdentifier(tree, rootDir, provider.name)
}

/**
 * Modify the file content so the import for Angular provider exists if it was not present already.
 * @param tree - the file tree used for file content reading
 * @param filePath - the path to a file to validate and update
 * @param provider - angular provider to import
 */
export function importProviderIfDoesNotExist(tree: Tree, filePath: string, provider: Provider) {
  const fileContent = tree.read(filePath, 'utf-8')
  if (!fileContent) return

  let updatedFileContent = fileContent

  if (!doesFileIncludeProviderImport(updatedFileContent, provider)) {
    updatedFileContent = includeProviderImportInFile(updatedFileContent, provider)
  }

  if (fileContent !== updatedFileContent) {
    tree.write(filePath, updatedFileContent)
  }
}

/**
 * Checks if file imports the Angular provider
 * @param fileContent - the path to a file to check
 * @param provider - angular provider to check
 * @returns {boolean} if the Angular provider is imported in file
 */
export function doesFileIncludeProviderImport(fileContent: string, provider: Provider): boolean {
  const contentAst = ast(fileContent)

  const allPatterns = [providerImportPattern(provider), importNamespacePattern(provider.importPath)].join(', ')
  const providerImports = query<ImportDeclaration>(contentAst, allPatterns)

  return providerImports.length > 0
}

/**
 * Add the import for Angular provider in the file.
 * @param fileContent - the path to a file to modify
 * @param provider - angular provider to add
 * @returns {string} modified content of the file with provider imported
 */
export function includeProviderImportInFile(fileContent: string, provider: Provider): string {
  if (doesIncludeNamespaceImport(fileContent, provider.importPath)) {
    return fileContent
  } else if (doesIncludeImport(fileContent, provider.importPath)) {
    return addToFirstImport(fileContent, provider.importPath, provider.name)
  } else {
    return createNewImport(fileContent, provider.importPath, [provider.name])
  }
}
