// General patterns

/**
 * Creates a pattern to look for a variable containing the identifier
 * @param identifierName - identifier to look for
 * @returns {string} ast query pattern
 */
export function variableContainingIdentifierPattern(identifierName: string) {
  return `VariableDeclaration:has(Identifier[name=${identifierName}])`
}

// Import patterns

/**
 * Creates a pattern to look for import.
 * @param importPath - import path to look for
 * @returns {string} ast query pattern
 */
export function importPattern(importPath: string) {
  return `ImportDeclaration:has(StringLiteral[value=${importPath}])`
}

/**
 * Creates a pattern to look for namespace import (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#namespace_import).
 * @param importPath - import path to look for
 * @returns {string} ast query pattern
 */
export function importNamespacePattern(importPath: string) {
  return `ImportDeclaration:has(StringLiteral[value=${importPath}]):has(NamespaceImport)`
}

/**
 * Creates a pattern to look for named import (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#named_import).
 * @param importPath - import path to look for
 * @returns {string} ast query pattern
 */
export function importNamedImportsPattern(importPath: string) {
  return `${importPattern(importPath)} NamedImports`
}
