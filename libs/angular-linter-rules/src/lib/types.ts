import type { TSESLint } from '@typescript-eslint/utils'

export type AngularLinterRulesPlugin = {
  rules: Record<string, TSESLint.RuleModule<string, readonly unknown[]>>
  configs: Record<string, TSESLint.Linter.Config>
}
