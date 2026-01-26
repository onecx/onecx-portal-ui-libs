import { rules } from './lib/rules'
import { configs } from './lib/configs'

export { rules, configs }

export const plugin = {

  rules,
  configs,
}

export type { AngularLinterRulesPlugin } from './lib/types'
