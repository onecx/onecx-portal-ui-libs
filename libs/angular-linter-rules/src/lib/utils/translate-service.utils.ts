import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import { isTranslateServiceType } from './type-utils'

function hasTranslateServiceName(node: TSESTree.CallExpression): boolean {
  if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return false

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

/**
 * Whether the call is made on an ngx-translate TranslateService: by its type when type information
 * is available, otherwise by the conventional names `translate` / `translateService`.
 */
export function isTranslateServiceCall(context: ContextWithTypeInfo, node: TSESTree.CallExpression): boolean {
  return hasTranslateServiceName(node) || isTranslateServiceReceiver(context, node)
}
