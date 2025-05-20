import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import {
  createPrinter,
  factory,
  ImportDeclaration,
  ImportSpecifier,
  isNamedImports,
  isStringLiteral,
  NamedImports,
  NodeArray,
  SourceFile,
  Statement,
} from 'typescript'
import { fileMatchesQuery, isFilePath } from './typescript-files.utils'
import { replaceInFile, replaceInFiles } from '../angular/replacement-in-files.utils'

interface ImportValueReplacement {
  oldValue: string
  newValue: string
}

interface ModuleImportReplacement {
  oldModuleSpecifier: string
  newModuleSpecifier: string
  valueReplacements: ImportValueReplacement[]
}

interface ImportUpdateResult {
  updatedImportDeclaration: ImportDeclaration | null
  remainingImportDeclaration: ImportDeclaration | null
}

interface SplitImportSpecifiersResult {
  matchedSpecifiers: ImportSpecifier[]
  unmatchedSpecifiers: ImportSpecifier[]
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

  try {
    replaceInFiles(tree, directoryPath, importModuleSpecifierQuery, '')
  } catch (error) {
    console.error(`Error removing imports by module specifier "${moduleSpecifier}" in ${directoryPath}: `, error)
  }
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

  try {
    replaceInFiles(tree, directoryPath, importModuleSpecifierQuery, `'${newModule}'`)
  } catch (error) {
    console.error(
      `Error replacing import module specifier from "${oldModule}" to "${newModule}" in ${directoryPath}: `,
      error
    )
  }
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

  const combinedQuery = values
    .flatMap((value) => [
      `ImportDeclaration:has(StringLiteral[value="${moduleSpecifier}"]) ImportSpecifier:has(Identifier[name="${value}"])`,
      `NamespaceImport:has(Identifier[name="${value}"])`,
      `ImportClause > Identifier[name="${value}"]`,
    ])
    .join(', ')

  try {
    if (isFilePath(directoryOrFilePath)) {
      replaceInFile(tree, directoryOrFilePath, combinedQuery, newImportValue)
    } else {
      replaceInFiles(tree, directoryOrFilePath, combinedQuery, newImportValue)
    }
  } catch (error) {
    console.error(`Error replacing import values in "${directoryOrFilePath}": `, error)
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

  try {
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
  } catch (error) {
    console.error(`Error removing import values from module "${moduleSpecifier}" in ${directoryPath}: `, error)
  }
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
export function replaceImportsInFile(
  fileContent: string,
  replacements: ModuleImportReplacement[],
  filterQuery?: string
): string | null {
  try {
    if (filterQuery && !fileMatchesQuery(fileContent, filterQuery)) {
      return null
    }

    let contentAst = ast(fileContent)
    let hasChanges = false

    for (const replacement of replacements) {
      const updatedContentAst = applyImportReplacement(contentAst, replacement)

      if (updatedContentAst) {
        contentAst = updatedContentAst
        hasChanges = true
      }
    }

    return hasChanges ? createPrinter().printFile(contentAst) : null
  } catch (error) {
    console.error('Error processing AST for import replacements: ', error)
    return null
  }
}

/**
 * Applies import replacements to a TypeScript AST.
 *
 * @param contentAst - The AST of the source file.
 * @param replacement - The module and value replacement configuration.
 * @returns The updated AST, or null if no changes were made.
 */
export function applyImportReplacement(contenAst: SourceFile, replacement: ModuleImportReplacement): SourceFile | null {
  try {
    const importDecl = findImportDeclaration(contenAst, replacement.oldModuleSpecifier)
    if (!importDecl?.importClause) {
      return null
    }

    const { updatedImportDeclaration, remainingImportDeclaration } = updateImportDeclaration(
      importDecl,
      replacement.valueReplacements,
      replacement.newModuleSpecifier
    )

    if (!updatedImportDeclaration && !remainingImportDeclaration) {
      return null
    }

    const updatedStatements = factory.createNodeArray(
      contenAst.statements.flatMap((statement): Statement[] => {
        if (statement === importDecl) {
          return [remainingImportDeclaration, updatedImportDeclaration].filter(
            (stmt): stmt is ImportDeclaration => stmt !== null
          )
        }
        return [statement]
      })
    )

    return factory.updateSourceFile(contenAst, updatedStatements)
  } catch (error) {
    console.error(`Error applying import replacement for module "${replacement.oldModuleSpecifier}": `, error)
    return null
  }
}

/**
 * Updates an import declaration by replacing specific named imports and updating the module specifier.
 * Only creates a new import if at least one named import is matched and replaced.
 * 
 * @param originalImport - The original import declaration node.
 * @param importValueReplacements - List of named import replacements.
 * @param newModuleName - The new module specifier.
 * @returns The updated import declaration, or the original if no replacements were made.
 */
export function updateImportDeclaration(
  originalImport: ImportDeclaration,
  importValueReplacements: ImportValueReplacement[],
  newModuleName: string
): ImportUpdateResult {
  const namedImports = getNamedImports(originalImport)
  if (!namedImports) {
    return { updatedImportDeclaration: null, remainingImportDeclaration: null }
  }

  const { matchedSpecifiers, unmatchedSpecifiers } = splitSpecifiers(namedImports.elements, importValueReplacements)

  const updatedImportDeclaration = createUpdatedImport(matchedSpecifiers, newModuleName)
  const remainingImportDeclaration = createRemainingImport(
    unmatchedSpecifiers,
    namedImports.elements.length,
    newModuleName,
    originalImport
  )

  return { updatedImportDeclaration, remainingImportDeclaration }
}

/**
 * Creates an updated import declaration with matched specifiers.
 * 
 * @param matchedSpecifiers - The matched import specifiers.
 * @param newModuleName - The new module specifier.
 * @returns The updated import declaration, or null if no specifiers were matched.
 * 
 */
export function createUpdatedImport(matchedSpecifiers: ImportSpecifier[], newModuleName: string): ImportDeclaration | null {
  return matchedSpecifiers.length > 0 ? buildImportDeclaration(matchedSpecifiers, newModuleName) : null
}

/**
 * Creates a remaining import declaration with unmatched specifiers.
 * 
 * @param unmatchedSpecifiers - The unmatched import specifiers.
 * @param originalCount - The original count of specifiers.
 * @param newModuleName - The new module specifier.
 * @param originalImport - The original import declaration.
 * @returns The remaining import declaration, or null if no specifiers were unmatched.
 * 
 */
export function createRemainingImport(
  unmatchedSpecifiers: ImportSpecifier[],
  originalCount: number,
  newModuleName: string,
  originalImport: ImportDeclaration
): ImportDeclaration | null {
  const originalModuleName = isStringLiteral(originalImport.moduleSpecifier) ? originalImport.moduleSpecifier.text : ''

  const shouldCreate =
    unmatchedSpecifiers.length > 0 &&
    (unmatchedSpecifiers.length !== originalCount || originalModuleName !== newModuleName)

  return shouldCreate ? buildImportDeclaration(unmatchedSpecifiers, originalModuleName) : null
}

/**
 * Constructs a new import declaration with the given specifiers and module name.
 *
 * @param specifiers - The updated import specifiers.
 * @param moduleName - The new module specifier.
 * @returns A new ImportDeclaration node.
 */
export function buildImportDeclaration(specifiers: ImportSpecifier[], moduleName: string): ImportDeclaration | null {
  if (specifiers.length === 0) {
    return null
  }

  const namedImports = factory.createNamedImports(specifiers)
  const importClause = factory.createImportClause(false, undefined, namedImports)

  return factory.createImportDeclaration(undefined, importClause, factory.createStringLiteral(moduleName), undefined)
}

/**
 * Splits import specifiers into matched and unmatched based on replacements.
 * Separate import specifiers that need to be replaced from those that don't.
 * 
 * @param specifiers - The original import specifiers.
 * @param replacements - List of replacements to apply.
 * @returns An object containing matched and unmatched specifiers.
 */
export function splitSpecifiers(
  specifiers: NodeArray<ImportSpecifier>,
  replacements: ImportValueReplacement[]
): SplitImportSpecifiersResult {
  const matchedSpecifiers: ImportSpecifier[] = []
  const unmatchedSpecifiers: ImportSpecifier[] = []

  for (const specifier of specifiers) {
    const replacement = replacements.find((r) => r.oldValue === specifier.name.text)
    if (replacement) {
      if (replacement.newValue.trim()) {
        matchedSpecifiers.push(
          factory.createImportSpecifier(false, specifier.propertyName, factory.createIdentifier(replacement.newValue))
        )
      }
    } else {
      unmatchedSpecifiers.push(specifier)
    }
  }

  return { matchedSpecifiers, unmatchedSpecifiers }
}

/**
 * Extracts named imports from an import declaration.
 *
 * @param importDeclaration - The import declaration node.
 * @returns The NamedImports node, if present.
 */
export function getNamedImports(importDeclaration: ImportDeclaration): NamedImports | undefined {
  try {
    const namedBindings = importDeclaration.importClause?.namedBindings
    if (namedBindings && isNamedImports(namedBindings)) {
      return namedBindings
    }
    console.warn('Named bindings are not of type NamedImports: ', namedBindings)
    return undefined
  } catch (error) {
    console.error('Error extracting named imports: ', error)
    return undefined
  }
}

/**
 * Finds the first import declaration for a given module name.
 *
 * @param sourceFile - The TypeScript source file AST.
 * @param moduleName - The module name to search for.
 * @returns The matching ImportDeclaration node, if found.
 */
export function findImportDeclaration(sourceFile: SourceFile, moduleName: string): ImportDeclaration | undefined {
  try {
    return query(sourceFile, `ImportDeclaration:has(StringLiteral[value="${moduleName}"])`)[0] as ImportDeclaration
  } catch (error) {
    console.error(`Error finding import declaration for module "${moduleName}": `, error)
    return undefined
  }
}
