import { definePreset } from '@primeng/themes'
import Aura from '@primeng/themes/aura'
import presetVariables from './preset-variables'
import { normalizeKeys } from '../utils/normalize-preset-keys.utils'

export const CustomPreset = definePreset(normalizeKeys(Aura), normalizeKeys(presetVariables))
CustomPreset['semantic'].colorScheme.dark = {}
export default CustomPreset
