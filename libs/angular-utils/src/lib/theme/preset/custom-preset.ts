import { definePreset } from '@primeng/themes'
import Aura from '@primeng/themes/aura'
import presetVariables from './preset-variables'

export const CustomPreset = definePreset(Aura, presetVariables)
CustomPreset.semantic.colorScheme.dark = {};
export default CustomPreset
