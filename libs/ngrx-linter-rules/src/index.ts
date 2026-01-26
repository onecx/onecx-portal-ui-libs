import { rules } from './lib/rules'
import { configs } from './lib/configs'

export { rules } from './lib/rules'
export { configs } from './lib/configs'

export const plugin = {
	rules,
	configs,
}

export type { NgrxLinterRulesPlugin } from './lib/types'
