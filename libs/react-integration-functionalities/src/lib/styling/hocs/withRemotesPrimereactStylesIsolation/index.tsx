import { ComponentType } from 'react';
import { PrimeReactStyleProvider } from '../../contexts/remotes';

export function withRemotesPrimereactStylesIsolation<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return (props: P) => (
    <PrimeReactStyleProvider>
      <Component {...props} />
    </PrimeReactStyleProvider>
  );
}
