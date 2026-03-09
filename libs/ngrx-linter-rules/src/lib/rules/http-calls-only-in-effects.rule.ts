import { ESLintUtils, type TSESLint, type TSESTree } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(() => 'https://onecx.github.io/')

type Options = []
type MessageIds = 'httpCallsOnlyInEffects'

const defaultAllowedFilePatterns = [/\.spec\.ts$/i, /\.test\.ts$/i, /\/testing\//i, /\/mocks\//i]

function isAllowedTestFile(filename: string): boolean {
  if (!filename || filename === '<input>' || filename === '<text>') return false
  return defaultAllowedFilePatterns.some((re) => re.test(filename))
}

function classContainsCreateEffectCall(context: TSESLint.RuleContext<MessageIds, Options>, node: TSESTree.ClassDeclaration): boolean {
  const classText = context.sourceCode.getText(node)
  return /\bcreateEffect\s*\(/.test(classText)
}

function isHttpClientCall(call: TSESTree.CallExpression): boolean {
  if (call.callee.type !== 'MemberExpression') return false
  if (call.callee.property.type !== 'Identifier') return false
  const name = call.callee.property.name

  return (
    name === 'get' ||
    name === 'post' ||
    name === 'put' ||
    name === 'patch' ||
    name === 'delete' ||
    name === 'head' ||
    name === 'options' ||
    name === 'request'
  )
}

function isHttpLikeMethodCall(call: TSESTree.CallExpression): boolean {
  if (call.callee.type !== 'MemberExpression') return false
  if (call.callee.property.type !== 'Identifier') return false

  const name = call.callee.property.name

  if (name === 'get' || name === 'post' || name === 'put' || name === 'patch' || name === 'delete') return true

  // OpenAPI / generated clients often use arbitrary method names like `getUser`.
  if (/^get[A-Z_]/.test(name)) return true
  if (/^post[A-Z_]/.test(name)) return true
  if (/^put[A-Z_]/.test(name)) return true
  if (/^patch[A-Z_]/.test(name)) return true
  if (/^delete[A-Z_]/.test(name)) return true

  return false
}

function isAnyHttpLikeCall(call: TSESTree.CallExpression): boolean {
  if (call.callee.type !== 'MemberExpression') return false
  if (call.callee.property.type !== 'Identifier') return false
  const name = call.callee.property.name
  return name === 'get' || name === 'post' || name === 'put' || name === 'patch' || name === 'delete'
}

function isOpenApiGeneratedServiceCall(call: TSESTree.CallExpression): boolean {
  if (call.callee.type !== 'MemberExpression') return false
  if (call.callee.property.type !== 'Identifier') return false

  const obj = call.callee.object
  if (obj.type === 'Identifier') {
    if (/ApiService$/i.test(obj.name)) return true
  }
  if (obj.type === 'MemberExpression') {
    if (obj.property.type === 'Identifier' && /ApiService$/i.test(obj.property.name)) return true
  }

  return false
}

function isCallOnGeneratedServiceName(call: TSESTree.CallExpression, generatedImportNames: Set<string>): boolean {
  if (generatedImportNames.size === 0) return false
  if (call.callee.type !== 'MemberExpression') return false
  const obj = call.callee.object

  if (obj.type === 'Identifier') {
    return generatedImportNames.has(obj.name)
  }

  if (obj.type === 'MemberExpression') {
    if (obj.object.type !== 'ThisExpression') return false
    if (obj.property.type !== 'Identifier') return false
    return generatedImportNames.has(obj.property.name)
  }

  return false
}

function isCallOnThisInjectedProperty(call: TSESTree.CallExpression, injectedProps: Set<string> | undefined): boolean {
  if (!injectedProps || injectedProps.size === 0) return false
  if (call.callee.type !== 'MemberExpression') return false

  const obj = call.callee.object
  if (obj.type !== 'MemberExpression') return false
  if (obj.object.type !== 'ThisExpression') return false
  if (obj.property.type !== 'Identifier') return false
  return injectedProps.has(obj.property.name)
}

function isCallOnInjectedProperty(call: TSESTree.CallExpression, injectedProps: Set<string> | undefined): boolean {
  if (!injectedProps || injectedProps.size === 0) return false
  if (call.callee.type !== 'MemberExpression') return false

  const obj = call.callee.object

  if (obj.type === 'Identifier') {
    return injectedProps.has(obj.name)
  }

  if (obj.type === 'MemberExpression') {
    if (obj.object.type !== 'ThisExpression') return false
    if (obj.property.type !== 'Identifier') return false
    return injectedProps.has(obj.property.name)
  }

  return false
}

function isSuspiciousHttpLikeName(name: string): boolean {
  return /^http$/i.test(name) || /HttpClient$/i.test(name)
}

function collectGeneratedImportNames(program: TSESTree.Program): Set<string> {
  const names = new Set<string>()

  for (const stmt of program.body) {
    if (stmt.type !== 'ImportDeclaration') continue
    const importPath = stmt.source.value
    if (typeof importPath !== 'string') continue
    if (!/\/generated\//i.test(importPath)) continue

    for (const specifier of stmt.specifiers) {
      if (specifier.type === 'ImportSpecifier') {
        names.add(specifier.local.name)
        continue
      }
      if (specifier.type === 'ImportDefaultSpecifier') {
        names.add(specifier.local.name)
        continue
      }
    }
  }

  return names
}

function isCallOnThisProperty(call: TSESTree.CallExpression): string | undefined {
  if (call.callee.type !== 'MemberExpression') return undefined
  const obj = call.callee.object
  if (obj.type !== 'MemberExpression') return undefined
  if (obj.object.type !== 'ThisExpression') return undefined
  if (obj.property.type !== 'Identifier') return undefined
  return obj.property.name
}

function isInjectCall(node: TSESTree.Node): node is TSESTree.CallExpression {
  if (node.type !== 'CallExpression') return false
  if (node.callee.type !== 'Identifier') return false
  return node.callee.name === 'inject'
}

export const httpCallsOnlyInEffects = createRule<Options, MessageIds>({
  name: 'http-calls-only-in-effects',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that HTTP calls are performed in NgRx effects and not in Angular components.',
    },
    schema: [],
    messages: {
      httpCallsOnlyInEffects: 'Perform HTTP calls in NgRx effects (classes using createEffect), not in components.',
    },
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename ?? ''
    if (isAllowedTestFile(filename)) return {}

    const isGeneratedFile = /\/generated\//i.test(filename)
    const generatedImportNames = collectGeneratedImportNames(context.sourceCode.ast)
    const isGeneratedClassName = (name: string): boolean => /ApiService$/i.test(name) || /ControllerService$/i.test(name)
    const isLikelyHttpServiceTypeName = (name: string): boolean =>
      isGeneratedClassName(name) || /Service$/i.test(name) || /Api$/i.test(name)

    const injectedServicePropertiesByClass = new WeakMap<TSESTree.ClassDeclaration, Set<string>>()
    const classStack: TSESTree.ClassDeclaration[] = []

    const inComponentClassStack: TSESTree.ClassDeclaration[] = []
    const inEffectClassStack: TSESTree.ClassDeclaration[] = []

    const isComponentDecorator = (decorator: TSESTree.Decorator): boolean => {
      const expr = decorator.expression
      if (expr.type !== 'CallExpression') return false
      if (expr.callee.type !== 'Identifier') return false
      return expr.callee.name === 'Component'
    }

    const classHasComponentDecorator = (node: TSESTree.ClassDeclaration): boolean => {
      const decorators = node.decorators ?? []
      return decorators.some(isComponentDecorator)
    }

    const isInComponent = (): boolean => inComponentClassStack.length > 0
    const isInEffect = (): boolean => inEffectClassStack.length > 0

    return {
      ClassDeclaration(node) {
        classStack.push(node)

        if (classHasComponentDecorator(node)) {
          inComponentClassStack.push(node)
        }
        if (classContainsCreateEffectCall(context, node)) {
          inEffectClassStack.push(node)
        }

        const injectedProps = new Set<string>()
        for (const member of node.body.body) {
          if (member.type !== 'PropertyDefinition') continue
          if (member.key.type !== 'Identifier') continue
          if (!member.value) continue
          if (!isInjectCall(member.value)) continue
          injectedProps.add(member.key.name)
        }

        for (const member of node.body.body) {
          if (member.type !== 'MethodDefinition') continue
          if (member.kind !== 'constructor') continue

          for (const param of member.value.params) {
            if (param.type !== 'TSParameterProperty') continue
            if (param.parameter.type !== 'Identifier') continue

            const typeAnnotation = param.parameter.typeAnnotation
            const typeNode = typeAnnotation?.typeAnnotation
            if (!typeNode) continue
            if (typeNode.type !== 'TSTypeReference') continue
            if (typeNode.typeName.type !== 'Identifier') continue

            const typeName = typeNode.typeName.name
            if (!isLikelyHttpServiceTypeName(typeName)) continue

            injectedProps.add(param.parameter.name)
          }
        }

        injectedServicePropertiesByClass.set(node, injectedProps)
      },
      'ClassDeclaration:exit'(node) {
        if (classStack.at(-1) === node) {
          classStack.pop()
        }
        if (inComponentClassStack.at(-1) === node) {
          inComponentClassStack.pop()
        }
        if (inEffectClassStack.at(-1) === node) {
          inEffectClassStack.pop()
        }
      },
      CallExpression(node) {
        if (!isInComponent()) return
        if (isInEffect()) return

        if (isGeneratedFile) return

        if (node.callee.type !== 'MemberExpression') return

        const currentClass = classStack.at(-1)
        const injectedProps = currentClass ? injectedServicePropertiesByClass.get(currentClass) : undefined
        const calledThisProp = isCallOnThisProperty(node)
        const isCallOnInjected = isCallOnInjectedProperty(node, injectedProps)
        const isCallOnThisInjected = isCallOnThisInjectedProperty(node, injectedProps)
        const isCallOnHttpLikeProperty = !!calledThisProp && isSuspiciousHttpLikeName(calledThisProp)
        const isCallOnGeneratedService = isCallOnGeneratedServiceName(node, generatedImportNames)


        if (
          !(isAnyHttpLikeCall(node) && isCallOnInjected) &&
          !(isHttpClientCall(node) && isCallOnHttpLikeProperty) &&
          !(isOpenApiGeneratedServiceCall(node) && (isCallOnInjected || isCallOnThisInjected)) &&
          !(isCallOnGeneratedService && (isCallOnInjected || isCallOnThisInjected)) &&
          !(isHttpLikeMethodCall(node) && (isCallOnInjected || isCallOnThisInjected))
        ) {
          return
        }

        context.report({
          node,
          messageId: 'httpCallsOnlyInEffects',
        })
      },
    } satisfies TSESLint.RuleListener
  },
})
