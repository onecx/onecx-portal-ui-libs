import { createContext, type ReactNode, useContext, useMemo } from 'react'
import { CurrentThemeTopic } from '@onecx/integration-interface'
import { useTopic } from '../utils/use-topic.utils'

/**
 * Theme context value shape.
 */
type ThemeContextValue = {
  currentTheme$: CurrentThemeTopic
}

/** Props for ThemeProvider. */
type ThemeProviderProps = {
  children: ReactNode
  value?: Partial<ThemeContextValue>
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Hook to access theme topic.
 * Must be used within ThemeProvider.
 *
 * @returns Theme topic container.
 * @throws Error when used outside ThemeProvider.
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
 *
 * @param children - React subtree consuming theme context.
 * @param value - Optional overrides for current theme topic.
 * @returns Provider wrapping the given children.
 */
const ThemeProvider = ({ children, value }: ThemeProviderProps) => {
  const currentTheme$ = useTopic(value?.currentTheme$, CurrentThemeTopic)

  const contextValue = useMemo(
    () => ({
      currentTheme$,
    }),
    [currentTheme$]
  )

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export { ThemeProvider, useTheme, ThemeContext }
export type { ThemeContextValue, ThemeProviderProps }
