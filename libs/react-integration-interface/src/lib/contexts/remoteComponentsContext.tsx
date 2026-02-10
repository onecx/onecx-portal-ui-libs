import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { RemoteComponentsTopic } from '@onecx/integration-interface'

interface RemoteComponentsContextValue {
  remoteComponents$: RemoteComponentsTopic
}

interface RemoteComponentsProviderProps {
  children: ReactNode
  value?: Partial<RemoteComponentsContextValue>
}

const RemoteComponentsContext = createContext<RemoteComponentsContextValue | null>(null)

/**
 * Hook to access remote components topic.
 * Must be used within RemoteComponentsProvider.
 *
 * @returns Remote components topic container.
 * @throws Error when used outside RemoteComponentsProvider.
 */
const useRemoteComponents = (): RemoteComponentsContextValue => {
  const context = useContext(RemoteComponentsContext)
  if (!context) {
    throw new Error('useRemoteComponents must be used within a RemoteComponentsProvider')
  }
  return context
}

/**
 * Provides remote components topic for slot resolution.
 *
 * @param children - React subtree consuming remote components context.
 * @param value - Optional overrides for the remote components topic.
 * @returns Provider wrapping the given children.
 */
const RemoteComponentsProvider: React.FC<RemoteComponentsProviderProps> = ({ children, value }) => {
  const remoteComponents$ = useMemo(
    () => value?.remoteComponents$ ?? new RemoteComponentsTopic(),
    [value?.remoteComponents$]
  )
  const isInternalRemoteComponentsTopic = !value?.remoteComponents$

  useEffect(() => {
    return () => {
      if (isInternalRemoteComponentsTopic) {
        remoteComponents$.destroy()
      }
    }
  }, [isInternalRemoteComponentsTopic, remoteComponents$])

  const contextValue = useMemo(
    () => ({
      remoteComponents$,
    }),
    [remoteComponents$]
  )

  return <RemoteComponentsContext value={contextValue}>{children}</RemoteComponentsContext>
}

export { RemoteComponentsProvider, useRemoteComponents, RemoteComponentsContext }
export type { RemoteComponentsContextValue, RemoteComponentsProviderProps }
