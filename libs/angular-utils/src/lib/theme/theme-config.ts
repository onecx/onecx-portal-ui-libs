import { createPalette, standardColorAdjustment } from '../utils/create-color-palette'

interface ThemeVariables {
  [key: string]: {
    [key: string]: string
  }
}
export default class ThemeConfig {
  constructor(private themeVariables: ThemeVariables | undefined) {}

  getConfig() {
    let primaryColor = (this.themeVariables as any)['general']['primary-color']
    return {
      semantic: {
        primary: {
          ...createPalette(primaryColor, standardColorAdjustment),
        },
        colorScheme: {
          light: {
            primary: {
              ...createPalette(primaryColor, standardColorAdjustment),
            },
            text: {
              color: (this.themeVariables as any)['general']['text-color'],
              hoverColor: (this.themeVariables as any)['general']['text-secondary-color'],
            },
            content: {
              background: (this.themeVariables as any)['general']['content-bg-color'],
              hoverBackground: (this.themeVariables as any)['general']['hover-bg-color'],
            },
          },
        },
      },
    }
  }
}
