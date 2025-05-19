import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import {
  createPrinter,
  factory,
  ImportDeclaration,
  ImportSpecifier,
  NamedImports,
  NodeArray,
  SourceFile,
  SyntaxKind,
} from 'typescript'
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
  const importModuleSpecifierQuery = `ImportDeclaration:has(StringLiteral[value="${moduleSpecifier}"]), VariableStatement:has(CallExpression:has(Identifier[name=require]):has(StringLiteral[value="${moduleSpecifier}"]))`

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
  const importModuleSpecifierQuery = `ImportDeclaration > StringLiteral[value="${oldModule}"], VariableStatement CallExpression:has(Identifier[name=require]) > StringLiteral[value="${oldModule}"]`

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
 * Replaces both import values and module names in TypeScript files.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Directory to search for files.
 * @param importReplacements - List of import module and value replacements.
 * @param filterQuery - Optional query to filter files before applying changes.
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

      const updatedContent = replaceImportsInFile(fileContent, importReplacements, filterQuery)
      if (updatedContent && updatedContent !== fileContent) {
        tree.write(filePath, updatedContent)
      }
    } catch (error) {
      console.error(`Error replacing/removing ImportValue and ModuleName for file ${filePath}: `, error)
    }
  })
}

/**
 * Processes a file's AST to apply import replacements.
 *
 * @param fileContent - The content of the file to process.
 * @param replacements - List of module and value replacements.
 * @param filterQuery - Optional custom string query to filter files before applying changes.
 * This can be used to limit the operation to files containing specific content (e.g., a class name or decorator).
 * @returns The updated file content, or null if no changes were made.
 */
function replaceImportsInFile(
  fileContent: string,
  replacements: ModuleImportReplacement[],
  filterQuery?: string
): string | null {
  try {
    if (filterQuery && !fileMatchesQuery(fileContent, filterQuery)) {
      return null
    }

    let contenAst = ast(fileContent)
    let hasChanges = false

    for (const replacement of replacements) {
      const updatedContenAst = applyImportReplacement(contenAst, replacement, () => {
        hasChanges = true
      })
      if (updatedContenAst) {
        contenAst = updatedContenAst
      }
    }

    return hasChanges ? createPrinter().printFile(contenAst) : null
  } catch (error) {
    console.error('Error processing AST for import replacements:', error)
    return null
  }
}

/**
 * Applies import replacements to a TypeScript AST.
 *
 * @param contenAst - The AST of the source file.
 * @param replacement - The module and value replacement configuration.
 * @param onChange - Callback to trigger when a change is made.
 * @returns The updated AST, or null if no changes were made.
 */
function applyImportReplacement(
  contenAst: SourceFile,
  replacement: ModuleImportReplacement,
  onChange: () => void
): SourceFile | null {
  try {
    const importDeclaration = findImportDeclaration(contenAst, replacement.oldModuleSpecifier)
    if (!importDeclaration?.importClause) {
      return null
    }

    const updatedImportDecl = updateImportDeclaration(
      importDeclaration,
      replacement.valueReplacements,
      replacement.newModuleSpecifier,
      onChange
    )

    const updatedStatements = factory.createNodeArray(
      contenAst.statements.map((statement) => (statement === importDeclaration ? updatedImportDecl : statement))
    )

    return factory.updateSourceFile(contenAst, updatedStatements)
  } catch (error) {
    console.error(`Error applying import replacement for module "${replacement.oldModuleSpecifier}":`, error)
    return null
  }
}

/**
 * Updates an import declaration with new named imports and module specifier.
 *
 * @param originalImport - The original import declaration node.
 * @param importValueReplacements - List of named import replacements.
 * @param newModuleName - The new module specifier.
 * @param onChange - Callback to trigger when a change is made.
 * @returns The updated import declaration.
 */
function updateImportDeclaration(
  originalImport: ImportDeclaration,
  importValueReplacements: ImportValueReplacement[],
  newModuleName: string,
  onChange: () => void
): ImportDeclaration {
  try {
    const namedBindings = getNamedImports(originalImport)
    if (!namedBindings) {
      return originalImport
    }

    const updatedSpecifiers = updateImportSpecifiers(namedBindings.elements, importValueReplacements, onChange)

    const newNamedImports = factory.createNamedImports(updatedSpecifiers)
    const newImportClause = factory.createImportClause(false, undefined, newNamedImports)

    return factory.createImportDeclaration(
      undefined,
      newImportClause,
      factory.createStringLiteral(newModuleName),
      undefined
    )
  } catch (error) {
    console.error(`Failed to update import declaration for module "${newModuleName}":`, error)
    return originalImport
  }
}

/**
 * Finds the first import declaration for a given module name.
 *
 * @param sourceFile - The TypeScript source file AST.
 * @param moduleName - The module name to search for.
 * @returns The matching ImportDeclaration node, if found.
 */
function findImportDeclaration(sourceFile: SourceFile, moduleName: string): ImportDeclaration | undefined {
  try {
    return query(sourceFile, `ImportDeclaration:has(StringLiteral[value="${moduleName}"])`)[0] as ImportDeclaration
  } catch (error) {
    console.error(`Error finding import declaration for module ${moduleName}: `, error)
    return undefined
  }
}

/**
 * Extracts named imports from an import declaration.
 *
 * @param importDeclaration - The import declaration node.
 * @returns The NamedImports node, if present.
 */
function getNamedImports(importDeclaration: ImportDeclaration): NamedImports | undefined {
  try {
    const namedBindings = importDeclaration.importClause?.namedBindings
    if (namedBindings && namedBindings.kind === SyntaxKind.NamedImports) {
      return namedBindings as NamedImports
    }
    console.warn('Named bindings are not of type NamedImports:', namedBindings)
    return undefined
  } catch (error) {
    console.error('Error extracting named imports:', error)
    return undefined
  }
}

/**
 * Updates import specifiers based on provided replacements.
 *
 * @param specifiers - The original import specifiers.
 * @param replacements - List of replacements to apply.
 * @param onChange - Callback to trigger when a change is made.
 * @returns The updated list of import specifiers.
 */
function updateImportSpecifiers(
  importSpecifiers: NodeArray<ImportSpecifier>,
  replacements: ImportValueReplacement[],
  onChange: () => void
): ImportSpecifier[] {
  try {
    return importSpecifiers.map((importSpecifier) => {
      const originalName = importSpecifier.name.text
      const replacement = replacements.find((r) => r.oldValue === originalName)

      if (replacement) {
        onChange()

        return factory.createImportSpecifier(
          false,
          importSpecifier.propertyName,
          factory.createIdentifier(replacement.newValue)
        )
      }

      return importSpecifier
    })
  } catch (error) {
    console.error('Error updating import specifiers:', error)
    return [...importSpecifiers]
  }
}
