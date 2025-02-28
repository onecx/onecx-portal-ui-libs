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
          font: (this.themeVariables as any)['font'],
          topbar: (this.themeVariables as any)['topbar'],
          sidebar: (this.themeVariables as any)['sidebar'],
          general: (this.themeVariables as any)['general'],
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
