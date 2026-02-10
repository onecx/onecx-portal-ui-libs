import type { ComponentType } from 'react'
import { AppStateProvider, ConfigurationProvider, UserProvider } from '@onecx/react-integration-interface'
import { SyncedRouterProvider } from '../routing'
import '../styling/dynamicScoping/index'
import { TranslationBridge } from './translationBridge'

/**
 * Wraps a component with the base providers used by remote components.
 */
export function withBaseProviders<P extends object>(RemoteComponent: ComponentType<P>): ComponentType<P> {
  return (props: P) => (
    <AppStateProvider>
      <ConfigurationProvider>
        <SyncedRouterProvider>
          <UserProvider>
            <TranslationBridge />
            <RemoteComponent {...props} />
          </UserProvider>
        </SyncedRouterProvider>
      </ConfigurationProvider>
    </AppStateProvider>
  )
}
