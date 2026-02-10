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

/**
 * Hook to access theme topic.
 * Must be used within ThemeProvider.
 */
const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

/**
 * Provides current theme topic.
 */
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
  return <ThemeContext value={contextValue}>{children}</ThemeContext>
}

export { ThemeProvider, useTheme, ThemeContext }
export type { ThemeContextValue, ThemeProviderProps }
