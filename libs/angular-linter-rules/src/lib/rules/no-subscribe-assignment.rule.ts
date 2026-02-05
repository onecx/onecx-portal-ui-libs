import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator((name) => `https://github.com/onecx/onecx-portal-ui-libs/tree/main/libs/angular-linter-rules#${name}`)

type Options = []
type MessageIds = 'assignmentOutside'

function isSubscribeCall(node: TSESTree.CallExpression): boolean {
  return node.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.callee.property.type === AST_NODE_TYPES.Identifier &&
    node.callee.property.name === 'subscribe'
}

function getFunctionArg(node: TSESTree.CallExpression): TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression | undefined {
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

function getDeclaredVariablesInFunctionBody(
  body: TSESTree.BlockStatement | TSESTree.Expression,
): Set<string> {
  const names = new Set<string>()
  if (body.type !== AST_NODE_TYPES.BlockStatement) return names

  for (const stmt of body.body) {
    if (stmt.type !== AST_NODE_TYPES.VariableDeclaration) continue
    for (const decl of stmt.declarations) {
      for (const id of getAssignedIdentifiers(decl.id as any)) {
        names.add(id.name)
      }
    }
  }

  return names
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
      assignmentOutside: 'Avoid assigning to outer-scope variables inside `subscribe`. Prefer `map/tap` + `async` pipe or return the value.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (!isSubscribeCall(node)) return

        const callback = getFunctionArg(node)
        if (!callback) return

        const callbackBody = callback.body
        const localDeclarations = getDeclaredVariablesInFunctionBody(callbackBody)

        const reportIfOuter = (identifier: TSESTree.Identifier) => {
          if (localDeclarations.has(identifier.name)) return
          context.report({
            node: identifier,
            messageId: 'assignmentOutside',
          })
        }

        const sourceCode = context.sourceCode
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
            if (n.argument.type === AST_NODE_TYPES.MemberExpression && n.argument.object.type === AST_NODE_TYPES.ThisExpression) {
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
