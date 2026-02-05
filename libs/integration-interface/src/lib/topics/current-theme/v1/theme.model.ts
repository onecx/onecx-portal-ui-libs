import { ThemeOverride } from "./theme-override.model"

export interface Theme {
    id?: string
    assetsUpdateDate?: string
    assetsUrl?: string
    logoUrl?: string
    faviconUrl?: string
    cssFile?: string
    description?: string
    name?: string
    previewImageUrl?: string
    properties?: { [key: string]: { [key: string]: string } }
    overrides?: Array<ThemeOverride>
  }