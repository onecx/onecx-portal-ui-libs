import { ast, query, replace } from '@phenomnomnominal/tsquery'
import { createPrinter, EmitHint, factory, isArrayLiteralExpression, ScriptKind, SyntaxKind } from 'typescript'

/**
 * Checks if a file's content matches a given tsquery string.
 *
 * @param fileContent - The content of the TypeScript file.
 * @param queryStr - A tsquery selector string.
 * @returns True if the file matches the query; otherwise, false.
 */
export function fileMatchesQuery(fileContent: string, queryStr: string): boolean {
  try {
    const contentAst = ast(fileContent)
    return query(contentAst, queryStr).length > 0
  } catch {
    return false
  }
}

/**
 * Removes empty slots (i.e., omitted expressions like `[1,,2]`) from all array literals
 * in a given TypeScript code string.
 *
 * @param code - The TypeScript source code as a string.
 * @returns A new string with all empty array slots removed.
 */
export function removeEmptySlotsFromArrays(code: string): string {
  try {
    return replace(
      code,
      'ArrayLiteralExpression',
      (node) => {
        if (!isArrayLiteralExpression(node)) return null

        const elements = node.elements.filter((expression) => expression.kind !== SyntaxKind.OmittedExpression)

        if (elements.length === node.elements.length) return null

        const updatedArray = factory.updateArrayLiteralExpression(node, elements)
        return createPrinter().printNode(EmitHint.Unspecified, updatedArray, node.getSourceFile())
      },
      ScriptKind.TS
    )
  } catch (error) {
    console.error(`Failed to remove empty array slots: `, error)
    return code
  }
}

export function isFilePath(path: string): boolean {
  return /\.[^.]+$/.test(path)
}
