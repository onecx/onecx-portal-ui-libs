import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query, replace } from '@phenomnomnominal/tsquery'
import { ArrayLiteralExpression, ClassDeclaration } from 'typescript'
import { detectVariablesIncludingIdentifier } from '../../utils/detect-variable.utils'
import { MatchingModule } from '../model/matching-module.model'
import { Provider } from '../model/provider-info.model'
import { Module } from '../model/module-info.model'
import {
  moduleImportIdentifierPattern,
  moduleProviderIdentifierPattern,
  moduleProvidersArrayPattern,
} from './patterns.utils'

/**
 * Detects variables that include the Angular module.
 * @param tree - the file tree to search in
 * @param rootDir - the directory to start searching from
 * @param module - the module to search for
 * @returns {string[]} a list of variable names that include the module
 */
export function detectVariablesIncludingModule(tree: Tree, rootDir: string, module: Module): string[] {
  return detectVariablesIncludingIdentifier(tree, rootDir, module.name)
}

/**
 * Detects Angular module definitions that import given module.
 * @param tree - the file tree to search in
 * @param rootDir - the directory to start searching from
 * @param module - the module to search for
 * @param variablesIncludingModule - the list of variable names containing the module to search for
 * @returns {MatchingModule[]} a list of found modules that import the module via direct declaration or variable
 */
export function detectModulesImportingModule(
  tree: Tree,
  rootDir: string,
  module: Module,
  variablesIncludingModule: string[]
): MatchingModule[] {
  const matchingModules: MatchingModule[] = []
  // Query for import in module directly
  const directImportPattern = moduleImportIdentifierPattern(module.name)
  // Query for import via a variable
  const importViaVariablePatterns = variablesIncludingModule.map((name) => moduleImportIdentifierPattern(name))

  visitNotIgnoredFiles(tree, rootDir, (file) => {
    const content = tree.read(file, 'utf-8')
    if (!content) return

    const contentAst = ast(content)

    const allPatterns = [...importViaVariablePatterns, directImportPattern].join(', ')
    const moduleNamesInFile: MatchingModule[] = query<ClassDeclaration>(contentAst, allPatterns)
      .map((classDeclaration) => classDeclaration.name?.text)
      .filter((className): className is string => !!className)
      .map((className) => {
        return {
          name: className,
          filePath: file,
        }
      })
    matchingModules.push(...moduleNamesInFile)
  })

  return matchingModules
}

/**
 * Modify content of the file with the given module so the import of Angular provider exists if it was not present already.
 * @param tree - the file tree used for file content reading
 * @param module - the module to modify
 * @param provider - the provider to include
 * @param variablesWithProvider - the list of variable names containing the provider to include
 */
export function includeProviderInModuleIfDoesNotExist(
  tree: Tree,
  module: MatchingModule,
  provider: Provider,
  variablesWithProvider: string[]
) {
  const moduleFileConent = tree.read(module.filePath, 'utf-8')
  if (!moduleFileConent) return

  let updatedModuleFileContent = moduleFileConent

  if (!doesModuleIncludeProvider(updatedModuleFileContent, module, provider, variablesWithProvider)) {
    updatedModuleFileContent = includeProviderInModule(updatedModuleFileContent, module, provider)
  }

  if (moduleFileConent !== updatedModuleFileContent) {
    tree.write(module.filePath, updatedModuleFileContent)
  }
}

/**
 * Checks if the Angular module include the provider in the providers list.
 * @param fileContent - the content of the file the module is used in
 * @param module - the module to check
 * @param provider - the provider to check
 * @param variablesWithProvider - the list of variable names containing the provider to check
 * @returns {boolean} if the module includes the provider
 */
export function doesModuleIncludeProvider(
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

/**
 * Add the provider to the providers list of the module.
 * @param fileContent - the content of the file the module is used in
 * @param module - the module to modify
 * @param provider - the provider to add
 * @returns {string} modified content of the file with provider included in the module
 */
export function includeProviderInModule(fileContent: string, module: MatchingModule, provider: Provider): string {
  const newContent = replace(fileContent, moduleProvidersArrayPattern(module.name), (node) => {
    // Prepare provider call expression
    const providerExpressionString = `${provider.name}()`

    // Prepare new providers array
    const aleNode = node as ArrayLiteralExpression
    const newExpressionArray: string[] = [
      ...aleNode.elements.map((expresion) => expresion.getText()),
      providerExpressionString,
    ]
    // Return text for new providers array
    return `[${newExpressionArray.join(',')}]`
  })

  return newContent
}
