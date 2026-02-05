import type { TSESLint } from '@typescript-eslint/utils'
import { rules } from './rules'

const pluginName = '@onecx/angular-linter-rules'

const recommendedRules = Object.keys(rules).reduce<Record<string, TSESLint.Linter.RuleEntry>>((acc, ruleName) => {
  acc[`${pluginName}/${ruleName}`] = 'warn'
  return acc
}, {})

export const configs: Record<string, TSESLint.Linter.Config> = {
  recommended: {
    plugins: [pluginName],
    rules: recommendedRules,
  },
}
