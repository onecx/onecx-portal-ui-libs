import type { ComponentType } from 'react'
import { SyncedRouterProvider } from '.'

/**
 * Wraps a component with the synced router provider.
 *
 * @param Component - Component to wrap.
 * @returns Wrapped component with synced router provider.
 */
export function withSyncedRouter<P extends object>(Component: ComponentType<P>): ComponentType<P> {
  return function SyncedRouterWrapper(props: P) {
    return (
      <SyncedRouterProvider>
        <Component {...props} />
      </SyncedRouterProvider>
    )
  }
}
