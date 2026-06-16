import { createContext, useContext, useMemo, type ReactNode } from 'react'
import {
  GlobalErrorTopic,
  GlobalLoadingTopic,
  CurrentMfeTopic,
  CurrentLocationTopic,
  CurrentPageTopic,
  CurrentWorkspaceTopic,
  IsAuthenticatedTopic,
} from '@onecx/integration-interface'

interface AppStateContextProps {
  globalError$: GlobalErrorTopic
  globalLoading$: GlobalLoadingTopic
  currentMfe$: CurrentMfeTopic
  currentLocation$: CurrentLocationTopic
  /**
   * This topic will only fire when pageInfo.path matches document.location.pathname,
   * if not it will fire undefined.
   */
  currentPage$: CurrentPageTopic
  currentWorkspace$: CurrentWorkspaceTopic
  /**
   * This Topic is initialized as soon as the authentication is done
   */
  isAuthenticated$: IsAuthenticatedTopic
}

const defaultGlobalError$ = new GlobalErrorTopic()
const defaultGlobalLoading$ = new GlobalLoadingTopic()
const defaultCurrentMfe$ = new CurrentMfeTopic()
const defaultCurrentLocation$ = new CurrentLocationTopic()
const defaultCurrentPage$ = new CurrentPageTopic()
const defaultCurrentWorkspace$ = new CurrentWorkspaceTopic()
const defaultIsAuthenticated$ = new IsAuthenticatedTopic()

const AppStateContext = createContext<AppStateContextProps>({} as any)

/**
 * Provides application state topics for portal integration.
 *
 * @param children - React subtree consuming the app state topics.
 * @param value - Optional overrides for topic instances.
 * @returns Provider wrapping the given children.
 */
const AppStateProvider = ({ children, value }: { children: ReactNode; value?: Partial<AppStateContextProps> }) => {
  const globalError$ = value?.globalError$ ?? defaultGlobalError$
  const globalLoading$ = value?.globalLoading$ ?? defaultGlobalLoading$
  const currentMfe$ = value?.currentMfe$ ?? defaultCurrentMfe$
  const currentLocation$ = value?.currentLocation$ ?? defaultCurrentLocation$
  const currentPage$ = value?.currentPage$ ?? defaultCurrentPage$
  const currentWorkspace$ = value?.currentWorkspace$ ?? defaultCurrentWorkspace$
  const isAuthenticated$ = value?.isAuthenticated$ ?? defaultIsAuthenticated$

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      globalError$,
      globalLoading$,
      currentMfe$,
      currentLocation$,
      currentPage$,
      currentWorkspace$,
      isAuthenticated$,
    }),
    [globalError$, globalLoading$, currentMfe$, currentLocation$, currentPage$, currentWorkspace$, isAuthenticated$]
  )

  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>
}

/**
 * Hook to access application state topics.
 * Must be used within AppStateProvider.
 *
 * @returns The app state topics instance.
 * @throws Error when used outside AppStateProvider.
 */
const useAppState = (): AppStateContextProps => {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}

export { AppStateProvider, useAppState, AppStateContext }
