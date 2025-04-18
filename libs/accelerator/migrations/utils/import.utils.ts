import { ast, query, replace } from '@phenomnomnominal/tsquery'
import { importNamedImportsPattern, importNamespacePattern, importPattern } from './patterns.utils'
import { ImportDeclaration, NamedImports } from 'typescript'

export function doesIncludeNamespaceImport(fileContent: string, importPath: string) {
  const contentAst = ast(fileContent)

  const namespaceImports = query<ImportDeclaration>(contentAst, importNamespacePattern(importPath))

  return namespaceImports.length > 0
}

export function doesIncludeImport(fileContent: string, importPath: string) {
  const contentAst = ast(fileContent)

  const imports = query<ImportDeclaration>(contentAst, importPattern(importPath))

  return imports.length > 0
}

export function addToFirstImport(fileContent: string, importPath: string, specifier: string) {
  let isAdded = false
  const newContent = replace(fileContent, importNamedImportsPattern(importPath), (node) => {
    if (isAdded) return null
    const niNode = node as NamedImports
    const newSpecifiers: string[] = [...niNode.elements.map((namedImport) => namedImport.getText()), specifier]
    return `{${newSpecifiers.join(',')}}`
  })
  return newContent
}

export function createNewImport(fileContent: string, importPath: string, specifiers: string[]) {
  return `import {${specifiers.join(',')}} from "${importPath}"\n${fileContent}`
}
