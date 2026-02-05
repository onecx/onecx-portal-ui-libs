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

const useRemoteComponents = (): RemoteComponentsContextValue => {
  const context = useContext(RemoteComponentsContext)
  if (!context) {
    throw new Error('useRemoteComponents must be used within a RemoteComponentsProvider')
  }
  return context
}

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

  return <RemoteComponentsContext.Provider value={contextValue}>{children}</RemoteComponentsContext.Provider>
}

export { RemoteComponentsProvider, useRemoteComponents, RemoteComponentsContext }
export type { RemoteComponentsContextValue, RemoteComponentsProviderProps }
