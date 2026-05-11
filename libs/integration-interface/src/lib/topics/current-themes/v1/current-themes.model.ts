import { ThemeOverride } from '../../current-theme/v1/theme-override.model'
import { ThemeProperties } from './current-themes.schema'

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
    overrides?: Array<ThemeOverride>
}

export interface CurrentThemes extends ThemeCommonData {
    properties: ThemeProperties
    versions: Array<1|2>
}