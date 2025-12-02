import { ComponentType } from 'react';
import { SyncedRouterProvider } from '.';

export function withSyncedRouter<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return function SyncedRouterWrapper(props: P) {
    return (
      <SyncedRouterProvider>
        <Component {...props} />
      </SyncedRouterProvider>
    );
  };
}
