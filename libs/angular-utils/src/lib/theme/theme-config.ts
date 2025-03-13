import { createPalette, standardColorAdjustment } from '../utils/create-color-palette'

interface ThemeVariables {
  [key: string]: {
    [key: string]: string
  }
}
export default class ThemeConfig {
  constructor(private themeVariables: ThemeVariables | undefined) {}

  getConfig() {
    const primaryColor = (this.themeVariables as any)['general']['primary-color']
    return {
      semantic: {
        extend: {
          ...(this.themeVariables as any)['font'],
          ...(this.themeVariables as any)['topbar'],
          ...(this.themeVariables as any)['sidebar'],
          ...(this.themeVariables as any)['general'],
        },
        primary: {
          ...createPalette(primaryColor, standardColorAdjustment),
        },
        colorScheme: {
          light: {
            primary: {
              ...createPalette(primaryColor, standardColorAdjustment),
            },
          },
        },
      },
    }
  }
}
