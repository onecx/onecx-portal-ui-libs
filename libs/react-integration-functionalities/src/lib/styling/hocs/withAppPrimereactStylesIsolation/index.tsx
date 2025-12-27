import { ComponentType } from 'react';
import { PrimeReactStyleProvider } from '../../contexts/app';

export function withAppPrimereactStylesIsolation<P extends object>(
  RemoteComponent: ComponentType<P>
): ComponentType<P> {
  return (props: P) => (
    <PrimeReactStyleProvider>
      <RemoteComponent {...props} />
    </PrimeReactStyleProvider>
  );
}
