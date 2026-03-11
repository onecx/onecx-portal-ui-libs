import { type ComponentType, createContext, type ReactNode, useContext } from 'react'

/**
 * Global application configuration passed through context.
 */
interface AppGlobals {
  PRODUCT_NAME: string
  [key: string]: string | number | boolean
}

const AppGlobalsContext = createContext<AppGlobals | null>(null)

/**
 * Provides app globals for the subtree.
 *
 * @param children - React subtree consuming app globals.
 * @param globals - App globals object.
 * @returns Provider wrapping the given children.
 */
const AppGlobalsProvider = ({ children, globals }: { children: ReactNode; globals: AppGlobals }) => (
  <AppGlobalsContext value={globals}>{children}</AppGlobalsContext>
)

/**
 * Wraps a component with the AppGlobalsProvider.
 *
 * @param Component - Component to wrap.
 * @param appGlobals - App globals to provide.
 * @returns Wrapped component with globals provider.
 */
export const withAppGlobals = <P extends object>(Component: ComponentType<P>, appGlobals: AppGlobals) => {
  const WrappedComponent = (props: P) => (
    <AppGlobalsProvider globals={appGlobals}>
      <Component {...props} />
    </AppGlobalsProvider>
  )

  WrappedComponent.displayName = `withAppGlobals(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}

/**
 * Hook to access app globals.
 * Must be used within AppGlobalsProvider.
 *
 * @returns App globals object.
 * @throws Error when used outside AppGlobalsProvider.
 */
export const useAppGlobals = () => {
  const context = useContext(AppGlobalsContext)
  if (context === null) {
    throw new Error('useAppGlobals must be used within an AppGlobalsProvider')
  }
  return context
}
