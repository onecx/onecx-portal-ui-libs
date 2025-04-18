import { Tree } from '@nx/devkit'
import { detectVariablesIncludingIdentifier } from './detect-variable.utils'
import { ProviderInfo } from '../model/provider-info.model'
import { ast, query } from '@phenomnomnominal/tsquery'
import { ImportDeclaration } from 'typescript'
import { addToFirstImport, createNewImport, doesIncludeImport, doesIncludeNamespaceImport } from './import.utils'
import { importNamespacePattern, providerImportPattern } from './patterns.utils'

export function detectVariablesIncludingProvider(tree: Tree, rootDir: string, providerInfo: ProviderInfo): string[] {
  return detectVariablesIncludingIdentifier(tree, rootDir, providerInfo.name)
}

export function importProviderIfDoesNotExist(tree: Tree, filePath: string, providerInfo: ProviderInfo) {
  const fileContent = tree.read(filePath, 'utf-8')
  if (!fileContent) return

  let updatedFileContent = fileContent

  if (!doesFileIncludeProviderImport(updatedFileContent, providerInfo)) {
    updatedFileContent = includeProviderImportInFile(updatedFileContent, providerInfo)
  }

  if (fileContent !== updatedFileContent) {
    tree.write(filePath, updatedFileContent)
  }
}

export function doesFileIncludeProviderImport(fileContent: string, providerInfo: ProviderInfo) {
  const contentAst = ast(fileContent)

  const allPatterns = [providerImportPattern(providerInfo), importNamespacePattern(providerInfo.importPath)].join(', ')
  const providerImports = query<ImportDeclaration>(contentAst, allPatterns)

  return providerImports.length > 0
}

export function includeProviderImportInFile(fileContent: string, providerInfo: ProviderInfo) {
  if (doesIncludeNamespaceImport(fileContent, providerInfo.importPath)) {
    return fileContent
  } else if (doesIncludeImport(fileContent, providerInfo.importPath)) {
    return addToFirstImport(fileContent, providerInfo.importPath, providerInfo.name)
  } else {
    return createNewImport(fileContent, providerInfo.importPath, [providerInfo.name])
  }
}
