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
        transitionDuration: '0.2s',
        focusRing: {
          width: '1px',
          style: 'solid',
          color: '{primary.color}',
          offset: '2px',
          shadow: 'none',
        },
        disabledOpacity: '0.6',
        iconSize: '1rem',
        anchorGutter: '2px',
        primary: {
          500: (this.themeVariables as any)['general']['primary-color'],
          600: (this.themeVariables as any)['general']['secondary-color'],
        },
      },
      // TODO: To be expanded
    }
  }
}
