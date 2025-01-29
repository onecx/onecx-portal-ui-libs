interface ThemeVariables {
  [key: string]: {
    [key: string]: string
  }
}

export default class ThemeConfig {
  constructor(private themeVariables: ThemeVariables | undefined) {}

  getConfig() {
    return {
      semantic: {
        primary: {
          500: (this.themeVariables as any)['general']['primary-color'],
          600: (this.themeVariables as any)['general']['secondary-color'],
        },
        colorScheme: {
          light: {
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
