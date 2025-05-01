import { ast, query, replace } from '@phenomnomnominal/tsquery'
import { importNamedImportsPattern, importNamespacePattern, importPattern } from '../utils/patterns.utils'
import { ImportDeclaration, NamedImports } from 'typescript'

/**
 * Checks if file contains import.
 * @param fileContent - the content of the file to check
 * @param importPath - import path to look for
 * @returns {boolean} if file contains the import
 */
export function doesIncludeImport(fileContent: string, importPath: string) {
  const contentAst = ast(fileContent)

  const imports = query<ImportDeclaration>(contentAst, importPattern(importPath))

  return imports.length > 0
}

/**
 * Checks if file contains namespace import (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#namespace_import).
 * @param fileContent - the content of the file to check
 * @param importPath - import path to look for
 * @returns {boolean} if file contains the namespace import
 */
export function doesIncludeNamespaceImport(fileContent: string, importPath: string) {
  const contentAst = ast(fileContent)

  const namespaceImports = query<ImportDeclaration>(contentAst, importNamespacePattern(importPath))

  return namespaceImports.length > 0
}

/**
 * Appends new importSpecifier to the named import (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#named_import).
 * @param fileContent - the content of the file to modify
 * @param importPath - import path to modify
 * @param importSpecifier - import specifier to add, e.g. "myFunctionName"
 * @returns {string} new file content after modification
 */
export function addToFirstImport(fileContent: string, importPath: string, importSpecifier: string) {
  let isAdded = false
  const newContent = replace(fileContent, importNamedImportsPattern(importPath), (node) => {
    if (isAdded) return null
    const niNode = node as NamedImports
    const newSpecifiers: string[] = [...niNode.elements.map((namedImport) => namedImport.getText()), importSpecifier]
    return `{${newSpecifiers.join(',')}}`
  })
  return newContent
}

/**
 * Creates new import statement with given import specifiers.
 * @param fileContent - the content of the file to modify
 * @param importPath - import path to create
 * @param importSpecifiers - import specifiers to add, e.g. "myFunctionName"
 * @returns {string} new file content after modification
 */
export function createNewImport(fileContent: string, importPath: string, importSpecifiers: string[]) {
  return `import {${importSpecifiers.join(',')}} from "${importPath}"\n${fileContent}`
}
