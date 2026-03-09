import type { TSESLint } from '@typescript-eslint/utils'
import { noStoreDispatchInEffect } from './no-store-dispatch-in-effect.rule'
import { httpCallsOnlyInEffects } from './http-calls-only-in-effects.rule'

export const rules: Record<string, TSESLint.RuleModule<string, readonly unknown[]>> = {
	'no-store-dispatch-in-effect': noStoreDispatchInEffect,
	'http-calls-only-in-effects': httpCallsOnlyInEffects,
}
