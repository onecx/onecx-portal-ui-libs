import { ast, query } from '@phenomnomnominal/tsquery'
import { importNamespacePattern } from './patterns.utils'
import { ImportDeclaration } from 'typescript'

/**
 * Checks if file contains namespace import (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#namespace_import).
 * @param fileContent - the content of the file to check
 * @param importPath - import path to look for
 * @returns {boolean} if file contains the namespace import
 */
export function isNamespaceImportInContent(fileContent: string, importPath: string) {
  const contentAst = ast(fileContent)

  const namespaceImports = query<ImportDeclaration>(contentAst, importNamespacePattern(importPath))

  return namespaceImports.length > 0
}
