import { replace } from '@phenomnomnominal/tsquery'
import { importNamedImportsPattern } from '../patterns.utils'
import { NamedImports } from 'typescript'

/**
 * Appends new importSpecifier to the named import (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#named_import).
 * @param fileContent - the content of the file to modify
 * @param importPath - import path to modify
 * @param importSpecifier - import specifier to add, e.g. "myFunctionName"
 * @returns {string} new file content after modification
 */
export function addToFirstImport(fileContent: string, importPath: string, importSpecifier: string) {
  const isAdded = false
  const newContent = replace(fileContent, importNamedImportsPattern(importPath), (node) => {
    if (isAdded) return null
    const niNode = node as NamedImports
    const newSpecifiers: string[] = [...niNode.elements.map((namedImport) => namedImport.getText()), importSpecifier]
    return `{${newSpecifiers.join(',')}}`
  })
  return newContent
}
