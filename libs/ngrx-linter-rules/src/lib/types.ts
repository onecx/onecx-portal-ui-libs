import type { TSESLint } from '@typescript-eslint/utils'

export type NgrxLinterRulesPlugin = {
  rules: Record<string, TSESLint.RuleModule<string, readonly unknown[]>>
  configs: Record<string, TSESLint.Linter.Config>
}
