import { ThemeOverride } from '../../current-theme/v1/theme-override.model'
import { Themes } from './current-themes.schema'

export interface CurrentThemes {
    id?: string
    assetsUpdateDate?: string
    assetsUrl?: string
    logoUrl?: string
    faviconUrl?: string
    cssFile?: string
    description?: string
    name?: string
    previewImageUrl?: string
    properties: Themes
    overrides?: Array<ThemeOverride>
    versions: Array<1|2>
}