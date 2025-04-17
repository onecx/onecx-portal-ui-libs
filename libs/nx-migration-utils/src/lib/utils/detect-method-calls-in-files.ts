import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import { CallExpression, isBinaryExpression, isCallExpression, isExpressionStatement, isIdentifier, isPropertyAccessExpression, isPropertyDeclaration, isVariableDeclaration, SourceFile, SyntaxKind } from 'typescript'

type MatchingMethodCalls = Map<string, CallExpression[]>
type DeclarationType = 'PropertyDeclaration' | 'VariableDeclaration'

function getDeclarationNames(contentAst: SourceFile, className: string, type: DeclarationType): string[] {
  const declarations = query(
    contentAst,
    `${type}:has(NewExpression > Identifier[name="${className}"])`
  )
  const memberNames = declarations.map((node) => {
    if ((type === 'VariableDeclaration' && isVariableDeclaration(node)) || (type === 'PropertyDeclaration' && isPropertyDeclaration(node))) {
      return node.name.getText()
    }
    throw new Error(`Node is not a ${type}`)
  })

  return memberNames
}

function getAssignmentNames(contentAst: SourceFile, className: string): string[] {
  const assignments = query(
    contentAst,
    `ExpressionStatement:has(BinaryExpression:has(EqualsToken):has(NewExpression > Identifier[name="${className}"]))`
  )
  const assignmentNames = assignments.map((node) => {
    if (isExpressionStatement(node)) {
      const binaryExpression = node.expression
      if (isBinaryExpression(binaryExpression)) {
        if (binaryExpression.operatorToken.kind == SyntaxKind.EqualsToken) {
          if(isPropertyAccessExpression(binaryExpression.left)) {
            return binaryExpression.left.name.escapedText.toString()
          } else if (isIdentifier(binaryExpression.left)) {
            return binaryExpression.left.escapedText.toString()
          } else {
            throw new Error('Node is not a PropertyAccessExpression or Identifier')
          }
        }
      }
    }
    throw new Error('Node is not an ExpressionStatement')
  })

  return assignmentNames
}

function getIdentifierCallQueries(contentAst: SourceFile, className: string, methodName: string): string[] {
  const variableNames = getDeclarationNames(contentAst, className, 'VariableDeclaration')

  const memberNames = getDeclarationNames(contentAst, className, 'PropertyDeclaration')

  const assignmentNames = getAssignmentNames(contentAst, className);

  const allIdentifiers = [...variableNames, ...memberNames, ...assignmentNames]

  // Only check variables once, even if their value is set multiple times
  const distinctIdentifiers = Array.from(new Set(allIdentifiers))

  const identifierCallPatterns = distinctIdentifiers.map(
    (name) =>
      `CallExpression:has(PropertyAccessExpression > Identifier[name="${name}"]):has(Identifier[name="${methodName}"])`
  )

  return identifierCallPatterns
}

export function detectMethodCallsInFiles(
  tree: Tree,
  rootDir: string,
  methodName: string,
  className: string
): MatchingMethodCalls {
  const matchingFiles: MatchingMethodCalls = new Map()

  // Look at each file inside of specified rootDir or any of its subdirectories that isn't gitignored
  visitNotIgnoredFiles(tree, rootDir, (file) => {
    const content = tree.read(file, 'utf-8')
    if (!content) return
    const contentAst = ast(content)

    // Queries for method calls on identifiers (e.g. x.method() or this.x.method())
    const identifierCallPatterns = getIdentifierCallQueries(contentAst, className, methodName)

    // Query for inline method calls (e.g. new ClassName().method())
    const inlineCallPattern = `CallExpression:has(NewExpression > Identifier[name="${className}"]):has(Identifier[name="${methodName}"])`

    const allPatterns = [...identifierCallPatterns, inlineCallPattern].join(', ')

    // Search for all elements matching computed queries
    let potentialMethodCalls: CallExpression[] = query(contentAst, allPatterns)

    // If no potential method calls are found, file can be ignored
    if (potentialMethodCalls.length === 0) return

    // Ensure that all detected method calls are indeed CallExpressions and filter out any other types
    potentialMethodCalls = potentialMethodCalls.filter((node) => isCallExpression(node))
    matchingFiles.set(file, potentialMethodCalls)
  })

  return matchingFiles
}
