import * as z from 'zod'

import { ThemeOverride } from '../../current-theme/v1/theme-override.model'
import { ThemeProperties } from './current-themes.schema'
import { fontDefinitions } from './font-definition.schema'

export interface ThemeCommonData {
  id?: string
  assetsUpdateDate?: string
  assetsUrl?: string
  logoUrl?: string
  faviconUrl?: string
  cssFile?: string
  description?: string
  name?: string
  previewImageUrl?: string
  customCssVariables?: Record<string, string>
  overrides?: Array<ThemeOverride>
  fonts?: z.infer<typeof fontDefinitions>
}

export interface CurrentThemes extends ThemeCommonData {
  properties: ThemeProperties
  versions: Array<1 | 2>
}
