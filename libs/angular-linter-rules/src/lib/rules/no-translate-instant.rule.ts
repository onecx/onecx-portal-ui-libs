import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import { isTranslateServiceType } from '../utils/type-utils'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/onecx/onecx-portal-ui-libs/tree/main/libs/angular-linter-rules#${name}`,
)

type Options = []
type MessageIds = 'noTranslateInstant'

const defaultAllowedFilePatterns = [/\.spec\.ts$/i, /\.test\.ts$/i, /\/testing\//i, /\/mocks\//i]

function isAllowedTestFile(filename: string): boolean {
  if (!filename || filename === '<input>' || filename === '<text>') return false
  return defaultAllowedFilePatterns.some((re) => re.test(filename))
}

function isInstantMemberCall(node: TSESTree.CallExpression): boolean {
  if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return false
  const property = node.callee.property
  if (property.type !== AST_NODE_TYPES.Identifier || property.name !== 'instant') return false

  const obj = node.callee.object
  if (obj.type === AST_NODE_TYPES.Identifier) {
    return obj.name === 'translate' || obj.name === 'translateService'
  }

  if (obj.type === AST_NODE_TYPES.MemberExpression) {
    if (obj.object.type !== AST_NODE_TYPES.ThisExpression) return false
    if (obj.property.type !== AST_NODE_TYPES.Identifier) return false
    return obj.property.name === 'translate' || obj.property.name === 'translateService'
  }

  return false
}

type ContextWithTypeInfo = {
  sourceCode: {
    parserServices?: {
      program?: unknown
      esTreeNodeToTSNodeMap?: unknown
    }
  }
}

function isTranslateServiceReceiver(context: ContextWithTypeInfo, node: TSESTree.CallExpression): boolean {
  if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return false
  if (!context.sourceCode.parserServices?.program) return false

  const { esTreeNodeToTSNodeMap, program } = context.sourceCode.parserServices
  if (!esTreeNodeToTSNodeMap) return false
  const checker = (program as any).getTypeChecker()

  const receiverTsNode = (esTreeNodeToTSNodeMap as any).get(node.callee.object as any)
  const receiverType = checker.getTypeAtLocation(receiverTsNode)
  if (isTranslateServiceType(checker, receiverType)) return true

  const receiverTypeText = checker.typeToString(receiverType)
  return receiverTypeText === 'TranslateService'
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

        if (isTranslateServiceReceiver(context as unknown as ContextWithTypeInfo, node)) {
          context.report({ node: node.callee, messageId: 'noTranslateInstant' })
          return
        }

        if (!isInstantMemberCall(node)) return

        context.report({
          node: node.callee,
          messageId: 'noTranslateInstant',
        })
      },
    }
  },
})
