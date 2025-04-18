import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query, replace } from '@phenomnomnominal/tsquery'
import { ArrayLiteralExpression, ClassDeclaration } from 'typescript'
import { detectVariablesIncludingIdentifier } from './detect-variable.utils'
import { MatchingModule } from '../model/matching-module.model'
import { ProviderInfo } from '../model/provider-info.model'
import { ModuleInfo } from '../model/module-info.model'
import {
  moduleImportIdentifierPattern,
  moduleProviderIdentifierPattern,
  moduleProvidersArrayPattern,
} from './patterns.utils'

export function detectVariablesIncludingModule(tree: Tree, rootDir: string, moduleInfo: ModuleInfo): string[] {
  return detectVariablesIncludingIdentifier(tree, rootDir, moduleInfo.name)
}

export function detectModulesImportingModule(
  tree: Tree,
  rootDir: string,
  moduleInfo: ModuleInfo,
  variablesIncludingModule: string[]
): MatchingModule[] {
  const matchingModules: MatchingModule[] = []
  // Query for import in module directly
  const directImportPattern = moduleImportIdentifierPattern(moduleInfo.name)
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

export function includeProviderInModuleIfDoesNotExist(
  tree: Tree,
  module: MatchingModule,
  providerInfo: ProviderInfo,
  variablesWithProvider: string[]
) {
  const moduleFileConent = tree.read(module.filePath, 'utf-8')
  if (!moduleFileConent) return

  let updatedModuleFileContent = moduleFileConent

  if (!doesModuleIncludeProvider(updatedModuleFileContent, module, providerInfo, variablesWithProvider)) {
    updatedModuleFileContent = includeProviderInModule(updatedModuleFileContent, module, providerInfo)
  }

  if (moduleFileConent !== updatedModuleFileContent) {
    tree.write(module.filePath, updatedModuleFileContent)
  }
}

export function doesModuleIncludeProvider(
  fileContent: string,
  module: MatchingModule,
  providerInfo: ProviderInfo,
  variablesWithProvider: string[]
): boolean {
  const contentAst = ast(fileContent)

  const directProviderPattern = moduleProviderIdentifierPattern(module.name, providerInfo.name)
  const provideViaVariablePatterns = variablesWithProvider.map((name) =>
    moduleProviderIdentifierPattern(module.name, name)
  )
  const allPatterns = [...provideViaVariablePatterns, directProviderPattern].join(', ')
  const modulesWithProvider = query<ClassDeclaration>(contentAst, allPatterns)

  return modulesWithProvider.length > 0
}

export function includeProviderInModule(fileContent: string, module: MatchingModule, providerInfo: ProviderInfo) {
  const newContent = replace(fileContent, moduleProvidersArrayPattern(module.name), (node) => {
    // Prepare provider call expression
    const providerExpressionString = `${providerInfo.name}()`

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
