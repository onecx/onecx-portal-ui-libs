import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import { CallExpression, isCallExpression } from 'typescript'

type MatchingMethodCalls = Map<string, CallExpression[]>

/**
 * Detects method calls with a given name within a specified directory or its subdirectories.
 * @param tree The file tree to search in.
 * @param rootDir The directory to start searching from.
 * @param methodName The name of the method to search for (e.g. 'myMethod').
 * @returns A map where the keys are file paths and the values are arrays of CallExpression nodes representing the detected method calls in the respective files.
 */
export function detectFunctionCallsInFiles(tree: Tree, rootDir: string, methodName: string): MatchingMethodCalls {
  const matchingFiles: MatchingMethodCalls = new Map()

  // Look at each file inside of specified rootDir or any of its subdirectories that isn't gitignored
  visitNotIgnoredFiles(tree, rootDir, (file) => {
    const content = tree.read(file, 'utf-8')
    if (!content) return
    const contentAst = ast(content)

    const callPattern = `CallExpression:has(Identifier[name="${methodName}"])`

    // Search for all elements matching computed queries
    let potentialMethodCalls: CallExpression[] = query(contentAst, callPattern)

    // If no potential method calls are found, file can be ignored
    if (potentialMethodCalls.length === 0) return

    // Ensure that all detected method calls are indeed CallExpressions and filter out any other types
    potentialMethodCalls = potentialMethodCalls.filter((node) => isCallExpression(node))
    matchingFiles.set(file, potentialMethodCalls)
  })

  return matchingFiles
}
