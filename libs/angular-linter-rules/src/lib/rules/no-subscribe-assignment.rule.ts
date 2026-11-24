import { AST_NODE_TYPES, ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/onecx/onecx-portal-ui-libs/tree/main/libs/angular-linter-rules#${name}`
)

type Options = []
type MessageIds = 'assignmentOutside'

function isSubscribeCall(node: TSESTree.CallExpression): boolean {
  return (
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.callee.property.type === AST_NODE_TYPES.Identifier &&
    node.callee.property.name === 'subscribe'
  )
}

function getFunctionArg(
  node: TSESTree.CallExpression
): TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression | undefined {
  for (const arg of node.arguments) {
    if (arg.type === AST_NODE_TYPES.ArrowFunctionExpression || arg.type === AST_NODE_TYPES.FunctionExpression) {
      return arg
    }
  }
  return undefined
}

type PatternLike =
  | TSESTree.Identifier
  | TSESTree.ArrayPattern
  | TSESTree.ObjectPattern
  | TSESTree.RestElement
  | TSESTree.AssignmentPattern

function getAssignedIdentifiers(pattern: PatternLike): TSESTree.Identifier[] {
  switch (pattern.type) {
    case AST_NODE_TYPES.Identifier:
      return [pattern]
    case AST_NODE_TYPES.ArrayPattern:
      return pattern.elements.flatMap((el) => (el ? getAssignedIdentifiers(el as PatternLike) : []))
    case AST_NODE_TYPES.ObjectPattern:
      return pattern.properties.flatMap((p) => {
        if (p.type === AST_NODE_TYPES.Property) return getAssignedIdentifiers(p.value as PatternLike)
        if (p.type === AST_NODE_TYPES.RestElement) return getAssignedIdentifiers(p.argument as PatternLike)
        return []
      })
    case AST_NODE_TYPES.RestElement:
      return getAssignedIdentifiers(pattern.argument as PatternLike)
    case AST_NODE_TYPES.AssignmentPattern:
      return getAssignedIdentifiers(pattern.left as PatternLike)
  }
}

const defaultAllowedFilePatterns = [/\.spec\.ts$/i, /\.test\.ts$/i, /\/testing\//i, /\/mocks\//i]

function isAllowedTestFile(filename: string): boolean {
  if (!filename || filename === '<input>' || filename === '<text>') return false
  return defaultAllowedFilePatterns.some((re) => re.test(filename))
}

export const noSubscribeAssignment = createRule<Options, MessageIds>({
  name: 'no-subscribe-assignment',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Warn when assigning inside an Observable subscribe callback to variables declared outside the callback (including class members).',
    },
    schema: [],
    messages: {
      assignmentOutside:
        'Avoid assigning to outer-scope variables inside `subscribe`. Prefer `map/tap` + `async` pipe or return the value.',
    },
  },
  defaultOptions: [],
  create(context) {
    if (isAllowedTestFile(context.filename)) return {}

    return {
      CallExpression(node) {
        if (!isSubscribeCall(node)) return

        const callback = getFunctionArg(node)
        if (!callback) return

        const callbackBody = callback.body
        const sourceCode = context.sourceCode

        // resolves the assigned variable through the scopes, so declarations in nested blocks and functions count as local
        const isDeclaredInCallback = (identifier: TSESTree.Identifier): boolean => {
          for (let scope: TSESLint.Scope.Scope | null = sourceCode.getScope(identifier); scope; scope = scope.upper) {
            const variable = scope.set.get(identifier.name)
            if (variable) {
              return variable.defs.some(
                (def) => def.name.range[0] >= callback.range[0] && def.name.range[1] <= callback.range[1]
              )
            }
          }
          return false
        }

        const reportIfOuter = (identifier: TSESTree.Identifier) => {
          if (isDeclaredInCallback(identifier)) return
          context.report({
            node: identifier,
            messageId: 'assignmentOutside',
          })
        }

        const visitor = (n: TSESTree.Node) => {
          if (n.type === AST_NODE_TYPES.AssignmentExpression) {
            if (n.left.type === AST_NODE_TYPES.MemberExpression) {
              if (n.left.object.type === AST_NODE_TYPES.ThisExpression) {
                context.report({ node: n.left, messageId: 'assignmentOutside' })
              }
              return
            }

            if (n.left.type === AST_NODE_TYPES.Identifier) {
              reportIfOuter(n.left)
              return
            }

            if (n.left.type === AST_NODE_TYPES.ObjectPattern || n.left.type === AST_NODE_TYPES.ArrayPattern) {
              for (const id of getAssignedIdentifiers(n.left)) {
                reportIfOuter(id)
              }
            }
            return
          }

          if (n.type === AST_NODE_TYPES.UpdateExpression) {
            if (n.argument.type === AST_NODE_TYPES.Identifier) {
              reportIfOuter(n.argument)
            }
            if (
              n.argument.type === AST_NODE_TYPES.MemberExpression &&
              n.argument.object.type === AST_NODE_TYPES.ThisExpression
            ) {
              context.report({ node: n.argument, messageId: 'assignmentOutside' })
            }
            return
          }

          for (const child of sourceCode.visitorKeys[n.type] ?? []) {
            const val = (n as any)[child]
            if (Array.isArray(val)) {
              for (const item of val) {
                if (item && typeof item.type === 'string') visitor(item)
              }
            } else if (val && typeof val.type === 'string') {
              visitor(val)
            }
          }
        }

        visitor(callbackBody)
      },
    }
  },
})
