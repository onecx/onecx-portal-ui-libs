import { createPalette, standardColorAdjustment } from './create-color-palette'
import { normalizeKeys } from './normalize-preset-keys.utils'

interface ThemeVariables {
  [key: string]: {
    [key: string]: string
  }
}
export default class ThemeConfig {
  constructor(private themeVariables: ThemeVariables | undefined) {
    // ThemeVariables are saved in kebab case but PrimeNg expects camel case
    this.themeVariables = this.transformVariablesToCamelCase(this.themeVariables ?? {})
  }

  getConfig() {
    const primaryColor = (this.themeVariables as any)['general']['primaryColor']
    return normalizeKeys({
      semantic: {
        extend: {
          onecx: {
            ...(this.themeVariables as any)['font'],
            ...(this.themeVariables as any)['topbar'],
            ...(this.themeVariables as any)['sidebar'],
            ...(this.themeVariables as any)['general'],
          },
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
    })
  }

  private transformVariablesToCamelCase(themeVariables: ThemeVariables) {
    const transformedThemeVariables: ThemeVariables = {}
    for (const section in themeVariables) {
      const sectionCamelCaseKey = this.toCamelCase(section)
      transformedThemeVariables[sectionCamelCaseKey] = this.transformSectionToCamelCase(
        themeVariables[sectionCamelCaseKey]
      )
    }
    return transformedThemeVariables
  }

  private transformSectionToCamelCase(section: { [key: string]: string }): { [key: string]: string } {
    const transformedSectionThemeVariables: { [key: string]: string } = {}
    for (const themeVariable in section) {
      const themeVariableCamelCase = this.toCamelCase(themeVariable)
      transformedSectionThemeVariables[themeVariableCamelCase] = section[themeVariable]
    }
    return transformedSectionThemeVariables
  }

  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
  }
}
