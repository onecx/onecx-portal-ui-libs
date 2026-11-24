import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import { isTranslateServiceCall } from '../utils/translate-service.utils'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/onecx/onecx-portal-ui-libs/tree/main/libs/angular-linter-rules#${name}`
)

type Options = []
type MessageIds = 'noTranslateInstant'

const defaultAllowedFilePatterns = [/\.spec\.ts$/i, /\.test\.ts$/i, /\/testing\//i, /\/mocks\//i]

function isAllowedTestFile(filename: string): boolean {
  if (!filename || filename === '<input>' || filename === '<text>') return false
  return defaultAllowedFilePatterns.some((re) => re.test(filename))
}

function isInstantCall(node: TSESTree.CallExpression): boolean {
  if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return false
  const property = node.callee.property
  return property.type === AST_NODE_TYPES.Identifier && property.name === 'instant'
}

export const noTranslateInstant = createRule<Options, MessageIds>({
  name: 'no-translate-instant',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow ngx-translate TranslateService.instant outside of tests.',
    },
    schema: [],
    messages: {
      noTranslateInstant:
        'Avoid `TranslateService.instant(...)` in production code. Use stream-based translation (`get`/`stream`) or the translate pipe instead.',
    },
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename
    const allowed = isAllowedTestFile(filename)

    return {
      CallExpression(node) {
        if (allowed) return
        if (!isInstantCall(node)) return
        if (!isTranslateServiceCall(context, node)) return

        context.report({
          node: node.callee,
          messageId: 'noTranslateInstant',
        })
      },
    }
  },
})
