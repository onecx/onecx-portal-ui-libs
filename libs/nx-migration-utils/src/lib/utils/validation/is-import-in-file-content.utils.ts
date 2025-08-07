import { ast, query } from '@phenomnomnominal/tsquery'
import { importSpecifierPattern } from '../patterns.utils'
import { ImportDeclaration } from 'typescript'
/**
 * Checks if file contains import specifier.
 * @param fileContent - the content of the file to check
 * @param importPath - import path to look for
 * @param specifier - import specifier to look for
 * @returns {boolean} if file contains the import
 */
export function isImportSpecifierInContent(fileContent: string, importPath: string, specifier: string) {
  const contentAst = ast(fileContent)

  const imports = query<ImportDeclaration>(contentAst, importSpecifierPattern(importPath, specifier))

  return imports.length > 0
}