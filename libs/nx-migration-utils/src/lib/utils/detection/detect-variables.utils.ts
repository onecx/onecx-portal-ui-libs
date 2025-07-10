import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import { VariableDeclaration } from 'typescript'

export interface VariableDetectionResult {
  filePath: string
  variableDeclaration: VariableDeclaration
}

/**
 * Detects variables in the project that match a specific pattern.
 * @param tree - The Nx virtual file system tree.
 * @param rootDir - The directory to start searching from.
 * @param variablePattern - The pattern to match variables (e.g., variable names or more complex structures).
 * @param filterQuery - Optional filter query to narrow down the results.
 * @returns {VariableDetectionResult[]} A list of detected variables with their file paths and declarations.
 */
export function detectVariables(
  tree: Tree,
  rootDir: string,
  variablePattern: string,
  filterQuery?: string
): VariableDetectionResult[] {
  const detectedVariables: VariableDetectionResult[] = []

  visitNotIgnoredFiles(tree, rootDir, (filePath) => {
    const content = tree.read(filePath, 'utf-8')
    if (!content) return

    const contentAst = ast(content)

    if (filterQuery) {
      const filteredAst = query(contentAst, filterQuery)
      if (filteredAst.length === 0) return // Skip if no nodes match the filter
    }

    const variables = query<VariableDeclaration>(contentAst, variablePattern)

    variables.forEach((variable) => {
      detectedVariables.push({
        filePath,
        variableDeclaration: variable,
      })
    })
  })

  return detectedVariables
}
