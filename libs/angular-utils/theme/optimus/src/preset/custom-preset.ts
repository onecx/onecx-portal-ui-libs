import { definePreset } from '@openng/optimus-ui-themes'
import Aura from '@openng/optimus-ui-themes/aura'
import presetVariables from './preset-variables'
import { normalizeKeys } from '../utils/normalize-preset-keys.utils'

export const CustomPreset = definePreset(normalizeKeys(Aura), normalizeKeys(presetVariables))
// @openng/optimus-ui-themes models `semantic` as `unknown` on its `Preset` type (unlike
// @primeng/themes, which typed it concretely). The runtime object still exposes
// `semantic.colorScheme`, so narrow the preset to the shape the dark-mode override needs.
;(CustomPreset as unknown as { semantic: { colorScheme: { dark: Record<string, never> } } }).semantic.colorScheme.dark = {}
export default CustomPreset
