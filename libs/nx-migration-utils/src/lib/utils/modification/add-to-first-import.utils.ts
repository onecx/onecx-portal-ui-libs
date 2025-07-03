import { replace } from '@phenomnomnominal/tsquery'
import { importNamedImportsPattern } from '../patterns.utils'
import { NamedImports, ScriptKind } from 'typescript'

/**
 * Appends new importSpecifier to the named import (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#named_import).
 * @param fileContent - the content of the file to modify
 * @param importPath - import path to modify
 * @param importSpecifier - import specifier to add, e.g. "myFunctionName"
 * @returns {string} new file content after modification
 */
export function addToFirstImport(fileContent: string, importPath: string, importSpecifiers: string[]) {
  let replaceTimes = 1
  const updatedFile = replace(
    fileContent,
    importNamedImportsPattern(importPath),
    (node) => {
      if (replaceTimes <= 0) return node.getText()
      const niNode = node as NamedImports
      const newSpecifiers: string[] = Array.from(
        new Set([...niNode.elements.map((namedImport) => namedImport.getText()), ...importSpecifiers])
      )
      replaceTimes -= 1
      return `{${newSpecifiers.join(',')}}`
    },
    ScriptKind.TS
  )

  return updatedFile
}
