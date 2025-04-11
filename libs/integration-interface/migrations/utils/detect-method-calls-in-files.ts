import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import { CallExpression, isBinaryExpression, isCallExpression, isExpressionStatement, isPropertyDeclaration, isVariableDeclaration, SyntaxKind } from 'typescript'

type MatchingMethodCalls = Map<string, CallExpression[]>

// TODO: Refactor and add comments
export function detectMethodCallsInFiles(
  tree: Tree,
  rootDir: string,
  methodName: string,
  className: string
): MatchingMethodCalls {
  const matchingFiles: MatchingMethodCalls = new Map()

  visitNotIgnoredFiles(tree, rootDir, (file) => {
    const content = tree.read(file, 'utf-8')
    // TODO: Check if this works if empty file exists in tree
    if (!content) return

    const contentAst = ast(content)

    const variableDeclarations = query(
      contentAst,
      `VariableDeclaration:has(NewExpression > Identifier[name="${className}"])`
    )
    const variableNames = variableDeclarations.map((node) => {
      if (isVariableDeclaration(node)) return node.name.getText()
      throw new Error('Node is not a VariableDeclaration')
    })

    const memberDeclarations = query(
      contentAst,
      `PropertyDeclaration:has(NewExpression > Identifier[name="${className}"])`
    )
    const memberNames = memberDeclarations.map((node) => {
      if (isPropertyDeclaration(node)) return node.name.getText()
      throw new Error('Node is not a PropertyDeclaration')
    })

    const assignments = query(
      contentAst,
      `ExpressionStatement:has(BinaryExpression:has(EqualsToken):has(NewExpression > Identifier[name="${className}"]))`
    )
    const assignmentNames = assignments.map((node) => {
      if (isExpressionStatement(node)) {
        const binaryExpression = node.expression
        if (isBinaryExpression(binaryExpression)) {
          if (binaryExpression.operatorToken.kind == SyntaxKind.EqualsToken) {
            // TODO: Improve typing
            return ((binaryExpression.left as any).name.escapedText)
          }
        }
      }
      throw new Error('Node is not a VariableDeclaration')
    })

    const allIdentifiers = [...variableNames, ...memberNames, ...assignmentNames]

    // Only check variables once, even if their value is set multiple times
    const distinctIdentifiers = Array.from(new Set(allIdentifiers))

    // Detect method calls on identifiers (e.g. x.method() or this.x.method())
    const identifierCallPatterns = distinctIdentifiers.map(
      (name) =>
        `CallExpression:has(PropertyAccessExpression > Identifier[name="${name}"]):has(Identifier[name="${methodName}"])`
    )

    // Detect inline method calls (e.g. new ClassName().method())
    const inlineCallPattern = `CallExpression:has(NewExpression > Identifier[name="${className}"]):has(Identifier[name="${methodName}"])`

    const allPatterns = [...identifierCallPatterns, inlineCallPattern].join(', ')
    let potentialMethodCalls: CallExpression[] = query(contentAst, allPatterns)
    if (potentialMethodCalls.length === 0) return
    potentialMethodCalls = potentialMethodCalls.filter((node) => isCallExpression(node))
    matchingFiles.set(file, potentialMethodCalls)
  })

  return matchingFiles
}
