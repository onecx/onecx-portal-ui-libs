import { ComponentType } from 'react';
import {
  AppStateProvider,
  ConfigurationProvider,
} from '@onecx/react-integration-interface';
import { SyncedRouterProvider } from '../routing';
import '../styling/dynamicScoping/index';

export function withBaseProviders<P extends object>(
  RemoteComponent: ComponentType<P>
): ComponentType<P> {
  return (props: P) => (
    <SyncedRouterProvider>
      <AppStateProvider>
        <ConfigurationProvider>
          <RemoteComponent {...props} />
        </ConfigurationProvider>
      </AppStateProvider>
    </SyncedRouterProvider>
  );
}
