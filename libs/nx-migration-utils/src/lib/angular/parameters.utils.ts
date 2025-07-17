import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, replace } from '@phenomnomnominal/tsquery'
import { ScriptKind } from 'typescript'
import { getParameterNames } from '../utils/detect-method-calls-in-files.utils'
import { fileMatchesQuery } from '../utils/typescript-files.utils'

/**
 * Removes constructor parameters of specified class types from TypeScript files.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Directory to search for files.
 * @param classNames - List of class names whose parameters should be removed.
 * @param filterQuery - Optional custom string query to filter files before applying changes.
 * This can be used to limit the operation to files containing specific content (e.g., a class name or decorator).
 */
export function removeParameters(tree: Tree, directoryPath: string, classNames: string[], filterQuery?: string) {
  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (!filePath.endsWith('.ts')) return

    try {
      const fileContent = tree.read(filePath, 'utf-8')
      if (!fileContent) return

      const contentAst = ast(fileContent)

      if (filterQuery && !fileMatchesQuery(fileContent, filterQuery)) return

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
