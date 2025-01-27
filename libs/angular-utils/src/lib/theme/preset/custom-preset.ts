import { definePreset } from '@primeng/themes'
import Aura from '@primeng/themes/aura'
import presetVariables from './preset-variables'

const CustomPreset = definePreset(Aura, presetVariables)

export default CustomPreset
