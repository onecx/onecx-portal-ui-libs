import { AST_NODE_TYPES, ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils'
import { isTranslateServiceCall } from '../utils/translate-service.utils'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/onecx/onecx-portal-ui-libs/tree/main/libs/angular-linter-rules#${name}`
)

type Options = []
type MessageIds = 'preferTranslateParams'
type Context = TSESLint.RuleContext<MessageIds, Options>

const defaultAllowedFilePatterns = [/\.spec\.ts$/i, /\.test\.ts$/i, /\/testing\//i, /\/mocks\//i]

function isAllowedTestFile(filename: string): boolean {
  if (!filename || filename === '<input>' || filename === '<text>') return false
  return defaultAllowedFilePatterns.some((re) => re.test(filename))
}

function isMethodCall(node: TSESTree.Node, methods: string[]): node is TSESTree.CallExpression {
  if (node.type !== AST_NODE_TYPES.CallExpression) return false
  if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return false
  if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return false
  return methods.includes(node.callee.property.name)
}

// get/stream are common method names (Map, HttpHeaders, Injector, ...), so the receiver must be a TranslateService
function isTranslateGetOrStreamCallExpression(context: Context, node: TSESTree.Node): boolean {
  return isMethodCall(node, ['get', 'stream']) && isTranslateServiceCall(context, node)
}

// instant is specific to ngx-translate, so any receiver counts
function isTranslateInstantCallExpression(node: TSESTree.Node): boolean {
  return isMethodCall(node, ['instant'])
}

function isTranslateGetOrStreamPipeCallExpression(
  context: Context,
  node: TSESTree.Node
): node is TSESTree.CallExpression {
  if (node.type !== AST_NODE_TYPES.CallExpression) return false
  if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return false
  if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return false
  if (node.callee.property.name !== 'pipe') return false

  const obj = node.callee.object
  return isTranslateGetOrStreamCallExpression(context, obj)
}

/** Whether a `+` concatenation occurs in the node; a `+` that builds a lookup key (`obj[a + b]`) does not count. */
function containsBinaryPlus(context: Context, node: TSESTree.Node): boolean {
  let found = false

  const visit = (n: TSESTree.Node): void => {
    if (found) return

    if (n.type === AST_NODE_TYPES.BinaryExpression && n.operator === '+') {
      found = true
      return
    }

    const keys = context.sourceCode.visitorKeys[n.type] ?? []
    for (const key of keys) {
      if (n.type === AST_NODE_TYPES.MemberExpression && n.computed && key === 'property') continue
      const value = (n as unknown as Record<string, unknown>)[key]
      if (!value) continue

      if (Array.isArray(value)) {
        for (const child of value) {
          if (found) return
          if (child && typeof child === 'object' && 'type' in (child as Record<string, unknown>)) {
            visit(child as TSESTree.Node)
          }
        }
        continue
      }

      if (value && typeof value === 'object' && 'type' in (value as Record<string, unknown>)) {
        visit(value as TSESTree.Node)
      }
    }
  }

  visit(node)
  return found
}

function isTranslatePipeExpression(node: TSESTree.Expression): boolean {
  if (node.type !== AST_NODE_TYPES.BinaryExpression || node.operator !== '|') return false
  const right = node.right
  return right.type === AST_NODE_TYPES.Identifier && right.name === 'translate'
}

export const preferTranslateParams = createRule<Options, MessageIds>({
  name: 'prefer-translate-params',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer translation parameters instead of concatenating translated strings (use e.g. `translate.get(key, { param })`).',
    },
    schema: [],
    messages: {
      preferTranslateParams:
        'Avoid concatenating translated strings. Prefer translation parameters/placeholders instead (e.g. `translate.get(key, { value })`).',
    },
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename
    const allowed = isAllowedTestFile(filename)

    if (allowed) {
      return {}
    }

    return {
      BinaryExpression(node) {
        if (node.operator !== '+') return
        if (
          isTranslateGetOrStreamCallExpression(context, node.left) ||
          isTranslateGetOrStreamCallExpression(context, node.right) ||
          isTranslateInstantCallExpression(node.left) ||
          isTranslateInstantCallExpression(node.right) ||
          isTranslatePipeExpression(node.left) ||
          isTranslatePipeExpression(node.right)
        ) {
          context.report({ node, messageId: 'preferTranslateParams' })
        }
      },
      TemplateLiteral(node) {
        if (
          !node.expressions.some(
            (expr) => isTranslateGetOrStreamCallExpression(context, expr) || isTranslateInstantCallExpression(expr)
          )
        ) {
          return
        }
        context.report({ node, messageId: 'preferTranslateParams' })
      },
      CallExpression(node) {
        // only the pipe operators process the translated text; the keys passed to get/stream may be built with `+`
        if (!isTranslateGetOrStreamPipeCallExpression(context, node)) return
        if (!node.arguments.some((arg) => containsBinaryPlus(context, arg))) return
        context.report({ node, messageId: 'preferTranslateParams' })
      },
    }
  },
})
