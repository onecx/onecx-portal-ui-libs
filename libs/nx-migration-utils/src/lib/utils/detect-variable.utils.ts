import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import { VariableDeclaration } from 'typescript'
import { variableContainingIdentifierPattern } from './patterns.utils'

/**
 * Detects variables that include the identifier.
 * @param tree - the file tree to search in
 * @param rootDir - the directory to start searching from
 * @param identifierName - the name of the identifier to search for (e.g., 'MyClass')
 * @returns {string[]} a list of variable names that include the identifier
 */
export function detectVariablesIncludingIdentifier(tree: Tree, rootDir: string, identifierName: string): string[] {
  const variableNames = new Set<string>()
  visitNotIgnoredFiles(tree, rootDir, (file) => {
    const content = tree.read(file, 'utf-8')
    if (!content) return

    const contentAst = ast(content)

    // Query for import via a variable
    const names = query<VariableDeclaration>(contentAst, variableContainingIdentifierPattern(identifierName)).map(
      (node) => node.name.getText()
    )

    names.forEach((name) => variableNames.add(name))
  })

  return Array.from(variableNames)
}
