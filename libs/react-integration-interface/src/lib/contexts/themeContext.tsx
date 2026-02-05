import { createContext, type ReactNode, useContext, useEffect, useMemo } from 'react'
import { CurrentThemeTopic } from '@onecx/integration-interface'

type ThemeContextValue = {
  currentTheme$: CurrentThemeTopic
}

type ThemeProviderProps = {
  children: ReactNode
  value?: Partial<ThemeContextValue>
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const ThemeProvider = ({ children, value }: ThemeProviderProps) => {
  const currentTheme$ = useMemo(() => value?.currentTheme$ ?? new CurrentThemeTopic(), [value?.currentTheme$])
  const isInternalTopic = !value?.currentTheme$

  const contextValue = useMemo(
    () => ({
      currentTheme$,
    }),
    [currentTheme$]
  )

  useEffect(() => {
    return () => {
      if (isInternalTopic) {
        currentTheme$.destroy()
      }
    }
  }, [currentTheme$, isInternalTopic])
  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export { ThemeProvider, useTheme, ThemeContext }
export type { ThemeContextValue, ThemeProviderProps }
