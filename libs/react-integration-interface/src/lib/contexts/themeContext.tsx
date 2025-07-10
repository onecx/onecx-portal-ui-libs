import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { CurrentThemeTopic, Theme } from '@onecx/integration-interface'
import { useConfiguration } from './configurationContext'
import { CONFIG_KEY } from '@onecx/angular-integration-interface'

const defaultThemeServerUrl = 'http://portal-theme-management:8080'

type Value = {
  currentTheme: Theme | null
  loadAndApplyTheme: (themeName: string) => Promise<void>
  getThemeHref: (themeIdthemeName: string) => string
}

const ThemeContext = createContext<Value>({
  currentTheme: null,
  loadAndApplyTheme: async () => {
    return
  },
  getThemeHref: () => '',
})

/**
 * Needs to be used within ThemeContext
 */
const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { config, isInitialized } = useConfiguration()
  const [currentTheme, setCurrentTheme] = useState<Value['currentTheme']>(null)
  const baseUrlV1 = './portal-api'
  const currentTheme$ = useMemo(() => new CurrentThemeTopic(), [])
  const getThemeHref: Value['getThemeHref'] = (themeId) => {
    const themeServerUrl = config?.[CONFIG_KEY.TKIT_PORTAL_THEME_SERVER_URL] || defaultThemeServerUrl
    return `${themeServerUrl}/themes/${themeId}/${themeId}.min.css`
  }

  const loadAndApplyTheme: Value['loadAndApplyTheme'] = async (themeName) => {
    if (!isInitialized) {
      console.log('Configuration is not initialized yet.')
      return
    }

    const theme = await loadTheme(themeName)
    if (theme) {
      setCurrentTheme(theme)
    }
  }

  const loadTheme = async (themeName: string): Promise<Theme | null> => {
    try {
      const response = await fetch(`${baseUrlV1}/internal/themes/${encodeURIComponent(themeName)}`)
      const theme = await response.json()
      return theme
    } catch (error) {
      console.error('Failed to load theme:', error)
      return null
    }
  }

  const contextValue = useMemo(
    () => ({
      currentTheme,
      loadAndApplyTheme,
      getThemeHref,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTheme]
  )

  useEffect(() => {
    return () => {
      currentTheme$.destroy()
    }
  }, [currentTheme$])
  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export { ThemeProvider, useTheme }
