import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query, replace } from '@phenomnomnominal/tsquery'
import {
  ArrayLiteralExpression,
  createPrinter,
  EmitHint,
  factory,
  ImportDeclaration,
  NamedImports,
  ScriptKind,
  SourceFile,
  SyntaxKind,
} from 'typescript'
import { getParameterNames } from './detect-method-calls-in-files'

interface ImportValueReplacement {
  oldImportValue: string
  newImportValue: string
}

interface ImportModuleReplacement {
  oldImportModuleName: string
  newImportModuleName: string
  valueReplacements: ImportValueReplacement[]
}

/**
 * Removes all import statements (ESM or CommonJS) for a given module from TypeScript files in a directory.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Path to the directory to search.
 * @param moduleName - The name of the module to remove imports for.
 */
export function removeImportStatement(tree: Tree, directoryPath: string, moduleName: string) {
  const importModuleQuery = `
        ImportDeclaration:has(StringLiteral[value="${moduleName}"]),
        VariableStatement:has(CallExpression:has(Identifier[name=require]):has(StringLiteral[value="${moduleName}"]))
    `

  processFilesWithQuery(tree, directoryPath, importModuleQuery, '')
}

/**
 * Replaces the module name in import statements with a new module name.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Path to the directory to search.
 * @param moduleName - The current module name to replace.
 * @param newName - The new module name to use.
 */
export function replaceImportModuleName(tree: Tree, directoryPath: string, moduleName: string, newName: string) {
  const importModuleQuery = `
        ImportDeclaration > StringLiteral[value="${moduleName}"],
        VariableStatement CallExpression:has(Identifier[name=require]) > StringLiteral[value="${moduleName}"]
    `

  processFilesWithQuery(tree, directoryPath, importModuleQuery, `'${newName}'`)
}

/**
 * Replaces specific named imports from a module with a new identifier.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryOrFilePath - Path to a directory or a specific file.
 * @param moduleName - The module from which imports are being replaced.
 * @param oldImportValues - One or more named imports to replace.
 * @param newImportValue - The new identifier to replace the old ones with.
 */
export function replaceImportValues(
  tree: Tree,
  targetPath: string,
  moduleName: string,
  oldImportValues: string | string[],
  newImportValue: string
) {
  const values = Array.isArray(oldImportValues) ? oldImportValues : [oldImportValues]

  const queries = values.flatMap((val) => [
    `ImportDeclaration:has(StringLiteral[value="${moduleName}"]) ImportSpecifier:has(Identifier[name="${val}"])`,
    `NamespaceImport:has(Identifier[name="${val}"])`,
    `ImportClause > Identifier[name="${val}"]`,
  ])

  const combinedQuery = queries.join(', ')
  const isFilePath = /\.[^.]+$/.test(targetPath)

  if (isFilePath) {
    updateFileContent(tree, targetPath, combinedQuery, newImportValue)
  } else {
    processFilesWithQuery(tree, targetPath, combinedQuery, newImportValue)
  }
}

/**
 * Removes specific named imports from a module by replacing them with an empty string.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Directory to search for files.
 * @param moduleName - The module from which to remove imports.
 * @param importValuesToRemove - One or more named imports to remove.
 * @param searchQuery - Optional custom query to narrow down the search.
 */
export function removeImportValuesFromModule(
  tree: Tree,
  directoryPath: string,
  moduleName: string,
  importValuesToRemove: string | string[],
  searchQuery?: string
) {
  const importValueRemovals = (Array.isArray(importValuesToRemove) ? importValuesToRemove : [importValuesToRemove]).map(
    (value) => ({
      oldImportValue: value,
      newImportValue: '',
    })
  )

  replaceImportValueAndModuleName(
    tree,
    directoryPath,
    [
      {
        oldImportModuleName: moduleName,
        newImportModuleName: moduleName,
        valueReplacements: importValueRemovals,
      },
    ],
    searchQuery
  )
}

/**
 * Replaces both import values and module names in TypeScript files.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Directory to search for files.
 * @param importReplacements - List of import module and value replacements.
 * @param searchQuery - Optional query to filter files before applying changes.
 */
export function replaceImportValueAndModuleName(
  tree: Tree,
  directoryPath: string,
  importReplacements: ImportModuleReplacement[],
  searchQuery?: string
) {
  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (!filePath.endsWith('.ts')) return

    try {
      const fileContent = tree.read(filePath, 'utf-8')
      if (!fileContent) return

      let contentAst = ast(fileContent)

      if (searchQuery) {
        const nodes = query(contentAst, searchQuery)
        if (!nodes.length) return
      }

      let hasChanges = false

      for (const importReplacement of importReplacements) {
        const importDeclaration = findImportDeclaration(contentAst, importReplacement.oldImportModuleName)
        if (!importDeclaration?.importClause) continue

        const updatedImportDeclaration = updateImportDeclaration(
          importDeclaration,
          importReplacement.valueReplacements,
          importReplacement.newImportModuleName,
          () => {
            hasChanges = true
          }
        )

        const updatedStatements = factory.createNodeArray(
          contentAst.statements.map((statement) =>
            statement === importDeclaration ? updatedImportDeclaration : statement
          )
        )

        contentAst = factory.updateSourceFile(contentAst, updatedStatements)
      }

      if (hasChanges) {
        const updatedContent = createPrinter().printFile(contentAst)
        tree.write(filePath, updatedContent)
      }
    } catch (error) {
      console.error(`Error replacing/removing ImportValue and ModuleName for file ${filePath}: `, error)
    }
  })
}

/**
 * Updates file content by replacing matches of a tsquery selector with a replacement string.
 *
 * @param tree - The Nx virtual file system tree.
 * @param filePath - Path to the file to update.
 * @param query - tsquery selector string.
 * @param replacement - Replacement string.
 */
function updateFileContent(tree: Tree, filePath: string, queryStr: string, replacement: string) {
  try {
    const fileContent = tree.read(filePath, 'utf-8')
    if (!fileContent) return

    let updatedContent = replace(fileContent, queryStr, () => replacement, ScriptKind.TS)
    if (replacement === '') {
      updatedContent = removeEmptySlotsFromArrays(updatedContent)
    }

    if (updatedContent !== fileContent) {
      tree.write(filePath, updatedContent)
    }
  } catch (error) {
    console.error(`Error updating file ${filePath}: `, error)
  }
}

/**
 * Updates all TypeScript files in a directory by applying a tsquery-based replacement.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Directory to search.
 * @param query - tsquery selector string.
 * @param replacement - Replacement string.
 */
export function updateContentFiles(tree: Tree, directoryPath: string, query: string, replacement: string) {
  processFilesWithQuery(tree, directoryPath, query, replacement)
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
 * Updates an import declaration by replacing named imports and the module name.
 *
 * @param importDeclaration - The original import declaration node.
 * @param valueReplacements - List of named import replacements.
 * @param newModuleName - The new module name.
 * @param onChange - Callback triggered if a change is made.
 * @returns A new ImportDeclaration node with the updates applied.
 */
function updateImportDeclaration(
  importDeclaration: ImportDeclaration,
  valueReplacements: ImportValueReplacement[],
  newModuleName: string,
  onChange: () => void
): ImportDeclaration {
  try {
    const namedImports = importDeclaration.importClause?.namedBindings as NamedImports

    const updatedImportSpecifiers = namedImports.elements.map((importSpecifier) => {
      const replacement = valueReplacements.find(
        (importValueReplacement) => importValueReplacement.oldImportValue === importSpecifier.name.text
      )
      if (replacement) {
        onChange()
        return factory.createImportSpecifier(
          false,
          importSpecifier.propertyName,
          factory.createIdentifier(replacement.newImportValue)
        )
      }
      return importSpecifier
    })

    const newNamedImports = factory.createNamedImports(updatedImportSpecifiers)
    const newImportClause = factory.createImportClause(false, undefined, newNamedImports)

    return factory.createImportDeclaration(
      undefined,
      newImportClause,
      factory.createStringLiteral(newModuleName),
      undefined
    )
  } catch (error) {
    console.error('Failed to update import declaration: ', error)
    return importDeclaration
  }
}

/**
 * Removes constructor parameters of specified class types from TypeScript files.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Directory to search for files.
 * @param classNames - List of class names whose parameters should be removed.
 * @param searchQuery - Optional query to filter files before applying changes.
 */
export function removeParameters(tree: Tree, directoryPath: string, classNames: string[], searchQuery?: string) {
  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (!filePath.endsWith('.ts')) return

    try {
      const fileContent = tree.read(filePath, 'utf-8')
      if (!fileContent) return

      const contentAst = ast(fileContent)

      if (searchQuery && query(contentAst, searchQuery).length === 0) {
        const nodes = query(contentAst, searchQuery)
        if (!nodes.length) return
      }

      const parameterNames = classNames.flatMap((className) => getParameterNames(contentAst, className))
      if (!parameterNames.length) return

      const parametersQuery = classNames
        .map((className) => `Parameter:has(TypeReference:has(Identifier[name="${className}"]))`)
        .join(', ')

      const parameterNamesQuery = parameterNames
        .map((parameterName) => `NewExpression > Identifier[name="${parameterName}"]`)
        .join(', ')

      let updatedContent = replace(fileContent, parametersQuery, () => '', ScriptKind.TS)
      updatedContent = replace(updatedContent, parameterNamesQuery, () => '', ScriptKind.TS)

      if (updatedContent !== fileContent) {
        tree.write(filePath, updatedContent)
      }
    } catch (error) {
      console.error(`Error removing parameters from file ${filePath}: `, error)
    }
  })
}

/**
 * Processes TypeScript files in a directory and applies a tsquery-based replacement.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Path to the directory to search.
 * @param query - tsquery selector string used to identify nodes for replacement.
 * @param replacement - Replacement string. If empty, trailing commas after removed nodes are also cleaned up.
 */
function processFilesWithQuery(tree: Tree, directoryPath: string, queryStr: string, replacement: string) {
  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (!filePath.endsWith('.ts')) return

    try {
      const fileContent = tree.read(filePath, 'utf-8')
      if (!fileContent) return

      let updatedContent = replace(fileContent, queryStr, () => replacement)

      if (replacement === '') {
        updatedContent = removeEmptySlotsFromArrays(updatedContent)
      }

      if (updatedContent !== fileContent) {
        tree.write(filePath, updatedContent)
      }
    } catch (error) {
      console.error(`Error processing with query for file ${filePath}: `, error)
    }
  })
}

/**
 * Removes empty slots from all array literals in the given code.
 *
 * @param code - The source code as a string.
 * @returns The updated code with empty slots removed from arrays.
 */
function removeEmptySlotsFromArrays(code: string): string {
  try {
    const contentAst = ast(code)
    const arrayNodes = query(contentAst, 'ArrayLiteralExpression') as ArrayLiteralExpression[]
    const printer = createPrinter()

    for (const arrayNode of arrayNodes) {
      const filteredElements = arrayNode.elements.filter(
        (expression) => expression.kind !== SyntaxKind.OmittedExpression
      )

      if (filteredElements.length === arrayNode.elements.length) continue

      const updatedArray = factory.updateArrayLiteralExpression(arrayNode, filteredElements)
      const originalText = printer.printNode(EmitHint.Unspecified, arrayNode, contentAst)
      const updatedText = printer.printNode(EmitHint.Unspecified, updatedArray, contentAst)

      code = code.replace(originalText, updatedText)
    }

    return code
  } catch (error) {
    console.error('Error removing empty slots from arrays: ', error)
    return code
  }
}
