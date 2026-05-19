import type { ComponentType } from 'react'
import { PrimeReactStyleProvider } from '../../contexts/app'

/**
 * Wraps a component with PrimeReact style isolation for the main app.
 *
 * @param RemoteComponent - Component to wrap.
 * @returns Wrapped component with PrimeReact scoping.
 */
export function withAppPrimereactStylesIsolation<P extends object>(
  RemoteComponent: ComponentType<P>
): ComponentType<P> {
  return (props: P) => (
    <PrimeReactStyleProvider>
      <RemoteComponent {...props} />
    </PrimeReactStyleProvider>
  )
}
