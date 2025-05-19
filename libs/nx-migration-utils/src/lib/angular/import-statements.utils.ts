import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { fileMatchesQuery } from '../utils/typescript-files.utils'
import { replaceInFile, replaceInFiles } from './replacement-in-files.utils'

interface ImportValueReplacement {
  oldValue: string
  newValue: string
}

interface ModuleImportReplacement {
  oldModuleSpecifier: string
  newModuleSpecifier: string
  valueReplacements: ImportValueReplacement[]
}

/**
 * Removes all import statements (ESM or CommonJS) for a given module from TypeScript files in a directory.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Path to the directory containing TypeScript files.
 * @param moduleSpecifier - The module name whose import statements should be removed.
 */
export function removeImportsByModuleSpecifier(tree: Tree, directoryPath: string, moduleSpecifier: string) {
  const importModuleSpecifierQuery = `
        ImportDeclaration:has(StringLiteral[value="${moduleSpecifier}"]),
        VariableStatement:has(CallExpression:has(Identifier[name=require]):has(StringLiteral[value="${moduleSpecifier}"]))
    `

  replaceInFiles(tree, directoryPath, importModuleSpecifierQuery, '')
}

/**
 * Replaces the module specifier in import statements with a new module name.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Path to the directory containing TypeScript files.
 * @param oldModule - The current module name to be replaced.
 * @param newModule - The new module name to use in import statements.
 */
export function replaceImportModuleSpecifier(tree: Tree, directoryPath: string, oldModule: string, newModule: string) {
  const importModuleSpecifierQuery = `
        ImportDeclaration > StringLiteral[value="${oldModule}"],
        VariableStatement CallExpression:has(Identifier[name=require]) > StringLiteral[value="${oldModule}"]
    `

  replaceInFiles(tree, directoryPath, importModuleSpecifierQuery, `'${newModule}'`)
}

/**
 * Replaces specific named imports from a module with a new identifier.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryOrFilePath - Path to a directory or a specific file.
 * @param moduleSpecifier - The module from which imports are being replaced.
 * @param oldImportValues - One or more named imports to replace.
 * @param newImportValue - The new identifier to replace the old named imports with.
 */
export function replaceImportValues(
  tree: Tree,
  directoryOrFilePath: string,
  moduleSpecifier: string,
  oldImportValues: string | string[],
  newImportValue: string
) {
  const values = Array.isArray(oldImportValues) ? oldImportValues : [oldImportValues]

  const queries = values.flatMap((value) => [
    `ImportDeclaration:has(StringLiteral[value="${moduleSpecifier}"]) ImportSpecifier:has(Identifier[name="${value}"])`,
    `NamespaceImport:has(Identifier[name="${value}"])`,
    `ImportClause > Identifier[name="${value}"]`,
  ])

  const combinedQuery = queries.join(', ')
  const isFilePath = /\.[^.]+$/.test(directoryOrFilePath)

  if (isFilePath) {
    replaceInFile(tree, directoryOrFilePath, combinedQuery, newImportValue)
  } else {
    replaceInFiles(tree, directoryOrFilePath, combinedQuery, newImportValue)
  }
}

/**
 * Replaces both named imports and module specifiers in two steps, with optional filtering using a tsquery string.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Path to a directory to search for `.ts` files.
 * @param importReplacements - An array of import replacement instructions, each containing:
 * - `oldModule`: the original module name to match.
 * - `newModule`: the new module name to replace with.
 * - `valueReplacements`: an array of named import replacements `{ oldValue, newValue }`.
 * @param filterQuery - Optional custom string query to filter files before applying changes.
 * This can be used to limit the operation to files containing specific content (e.g., a class name or decorator).
 */
export function replaceImportValuesAndModule(
  tree: Tree,
  directoryPath: string,
  importReplacements: ModuleImportReplacement[],
  filterQuery?: string
) {
  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (!filePath.endsWith('.ts')) return

    try {
      const fileContent = tree.read(filePath, 'utf-8')
      if (!fileContent) return

      if (filterQuery && !fileMatchesQuery(fileContent, filterQuery)) return

      applyImportReplacements(tree, filePath, importReplacements)
    } catch (error) {
      console.error(`Error replacing import values and module for file ${filePath}:`, error)
    }
  })
}

/**
 * Removes specific named imports from a module by replacing them with an empty string.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Path to the directory containing TypeScript files.
 * @param moduleSpecifier - The module from which to remove imports.
 * @param importValuesToRemove - One or more named imports to remove.
 * @param filterQuery - Optional custom string query to filter files before applying changes.
 * This can be used to limit the operation to files containing specific content (e.g., a class name or decorator).
 */
export function removeImportValuesFromModule(
  tree: Tree,
  directoryPath: string,
  moduleSpecifier: string,
  importValuesToRemove: string | string[],
  filterQuery?: string
) {
  const importValueRemovals = (Array.isArray(importValuesToRemove) ? importValuesToRemove : [importValuesToRemove]).map(
    (value) => ({
      oldValue: value,
      newValue: '',
    })
  )

  replaceImportValuesAndModule(
    tree,
    directoryPath,
    [
      {
        oldModuleSpecifier: moduleSpecifier,
        newModuleSpecifier: moduleSpecifier,
        valueReplacements: importValueRemovals,
      },
    ],
    filterQuery
  )
}

/**
 * Applies a set of import transformations to a single TypeScript file.
 *
 * This includes:
 * - Replacing specific named imports from a given module.
 * - Updating the module specifier if it has changed.
 *
 * @param tree - The Nx virtual file system tree.
 * @param filePath - The path to the TypeScript file to modify.
 * @param replacements - An array of import replacement instructions. Each instruction includes:
 * - `oldModule`: The original module name to match.
 * - `newModule`: The new module name to replace it with.
 * - `valueReplacements`: An array of named import replacements `{ oldValue, newValue }`.
 */
function applyImportReplacements(tree: Tree, filePath: string, replacements: ModuleImportReplacement[]) {
  for (const { oldModuleSpecifier, newModuleSpecifier, valueReplacements } of replacements) {
    for (const { oldValue, newValue } of valueReplacements) {
      replaceImportValues(tree, filePath, oldModuleSpecifier, oldValue, newValue)
    }

    if (oldModuleSpecifier !== newModuleSpecifier) {
      replaceImportModuleSpecifier(tree, filePath, oldModuleSpecifier, newModuleSpecifier)
    }
  }
}
