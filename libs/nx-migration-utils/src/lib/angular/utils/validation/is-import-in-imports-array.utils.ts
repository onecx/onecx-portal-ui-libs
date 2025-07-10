import { Tree } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import { ClassDeclaration } from 'typescript'

export interface ImportValidationOptions {
  /**
   * The source module where the import should come from.
   */
  importSource?: string

  /**
   * A list of queries to validate additional properties of the import.
   */
  importArrayQueries?: string[]

  /**
   * A list of queries to validate additional properties of the import.
   * These queries are applied to the global scope, not just the imports array.
   */
  globalQueries?: string[]

  /**
   * The name of the class to validate within the file.
   */
  className?: string
}

/**
 * Validates if a component or module contains an entry in the imports array.
 * Optionally validates where the value is imported from and additional nested queries.
 *
 * @param tree - The Nx virtual file system tree.
 * @param filePath - The path to the file containing the component or module.
 * @param importName - The name of the import to validate.
 * @param options - Optional parameters for validation.
 * @returns {boolean} True if the import is found in the imports array and matches the criteria, false otherwise.
 */
export function isImportInImportsArray(
  tree: Tree,
  filePath: string,
  importName: string,
  options?: ImportValidationOptions
): boolean {
  const fileContent = tree.read(filePath, 'utf-8')
  if (!fileContent) return false

  const contentAst = ast(fileContent)

  // Query for the imports array in NgModule or Component
  const importsArrayQuery =
    'ClassDeclaration:has(Decorator > CallExpression > Identifier[name="NgModule"]):has(PropertyAssignment[name.name="imports"]), ClassDeclaration:has(Decorator > CallExpression > Identifier[name="Component"]):has(PropertyAssignment[name.name="imports"])'

  const classDeclarations = query<ClassDeclaration>(contentAst, importsArrayQuery)

  for (const classDeclaration of classDeclarations) {
    if (options?.className && classDeclaration.name?.text !== options.className) {
      continue
    }

    const importsArrayQuery = `PropertyAssignment[name.name="imports"] ArrayLiteralExpression` // Find the imports array
    const importsArray = query(classDeclaration, importsArrayQuery)

    if (importsArray.length > 0) {
      const importEntryQuery = `CallExpression:has(Identifier[name="${importName}"]), Identifier[name="${importName}"]`
      const importEntries = query(importsArray[0], importEntryQuery)

      if (importEntries.length > 0) {
        if (options?.importSource) {
          // Validate the source of the import
          const importSourceQuery = `ImportDeclaration:has(StringLiteral[value="${options.importSource}"]) ImportSpecifier:has(Identifier[name="${importName}"])`
          const importSourceMatches = query(contentAst, importSourceQuery)
          if (importSourceMatches.length === 0) {
            return false
          }
        }

        if (options?.importArrayQueries) {
          // Validate additional nested properties of the import
          for (const nestedQuery of options.importArrayQueries) {
            const nestedMatches = query(importEntries[0], nestedQuery)
            if (nestedMatches.length === 0) {
              return false
            }
          }
        }

        if (options?.globalQueries) {
          // Validate additional global properties of the import
          for (const globalQuery of options.globalQueries) {
            const globalMatches = query(contentAst, globalQuery)
            if (globalMatches.length === 0) {
              return false
            }
          }
        }

        return true
      }
    }
  }

  return false
}
