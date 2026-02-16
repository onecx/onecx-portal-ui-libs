import { ESLintUtils, type TSESLint, type TSESTree } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(() => 'https://onecx.github.io/')

export const noStoreDispatchInEffect = createRule({
  name: 'no-store-dispatch-in-effect',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow calling Store.dispatch() inside @ngrx/effects effect classes.',
    },
    schema: [],
    messages: {
      noStoreDispatchInEffect: 'Do not call Store.dispatch() inside an effect class.',
    },
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename ?? ''
    const isTestFile =
      /\.(spec|test)\.ts$/i.test(filename) || /\/testing\//i.test(filename) || /\/mocks\//i.test(filename)

    if (isTestFile) {
      return {}
    }

    const services = ESLintUtils.getParserServices(context, true)
    const program = services.program
    const typeChecker = program?.getTypeChecker()

    const effectClasses = new Set<TSESTree.ClassDeclaration>()
    const activeEffectClassNesting: TSESTree.ClassDeclaration[] = []

    const classContainsCreateEffectCall = (node: TSESTree.ClassDeclaration): boolean => {
      const classText = context.sourceCode.getText(node)
      return /\bcreateEffect\s*\(/.test(classText)
    }

    const isStoreDispatchCall = (call: TSESTree.CallExpression): boolean => {
      if (call.callee.type !== 'MemberExpression') {
        return false
      }
      if (call.callee.property.type !== 'Identifier' || call.callee.property.name !== 'dispatch') {
        return false
      }

      const calleeObject = call.callee.object
      if (calleeObject.type === 'Super') {
        return false
      }

      if (!typeChecker || !program) {
        return true
      }

      const tsNode = services.esTreeNodeToTSNodeMap.get(calleeObject)
      const objectType = typeChecker.getTypeAtLocation(tsNode)
      const symbol = objectType.getSymbol() ?? objectType.aliasSymbol
      if (!symbol) {
        return true
      }

      return symbol.getName() === 'Store'
    }

    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        if (classContainsCreateEffectCall(node)) {
          effectClasses.add(node)
        }

        if (effectClasses.has(node)) {
          activeEffectClassNesting.push(node)
        }
      },
      'ClassDeclaration:exit'(node: TSESTree.ClassDeclaration) {
        if (effectClasses.has(node) && activeEffectClassNesting.at(-1) === node) {
          activeEffectClassNesting.pop()
        }
      },
      CallExpression(node: TSESTree.CallExpression) {
        if (activeEffectClassNesting.length === 0) {
          return
        }
        if (!isStoreDispatchCall(node)) {
          return
        }
        context.report({
          node,
          messageId: 'noStoreDispatchInEffect',
        })
      },
    } satisfies TSESLint.RuleListener
  },
})
