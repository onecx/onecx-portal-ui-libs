import type { ComponentType } from 'react'
import { PrimeReactStyleProvider } from '../../contexts/remotes'

/**
 * Wraps a component with PrimeReact style isolation for remotes.
 *
 * @param Component - Component to wrap.
 * @returns Wrapped component with PrimeReact scoping.
 */
export function withRemotesPrimereactStylesIsolation<P extends object>(Component: ComponentType<P>): ComponentType<P> {
  return (props: P) => (
    <PrimeReactStyleProvider>
      <Component {...props} />
    </PrimeReactStyleProvider>
  )
}
