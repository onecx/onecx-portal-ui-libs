import { ast, query } from '@phenomnomnominal/tsquery'
import { importPattern } from '../patterns.utils'
import { ImportDeclaration } from 'typescript'
/**
 * Checks if file contains import.
 * @param fileContent - the content of the file to check
 * @param importPath - import path to look for
 * @returns {boolean} if file contains the import
 */
export function isImportInContent(fileContent: string, importPath: string) {
  const contentAst = ast(fileContent)

  const imports = query<ImportDeclaration>(contentAst, importPattern(importPath))

  return imports.length > 0
}
