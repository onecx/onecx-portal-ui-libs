import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import { VariableDeclaration } from 'typescript'
import { variableContainingIdentifierPattern } from './patterns.utils'

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
