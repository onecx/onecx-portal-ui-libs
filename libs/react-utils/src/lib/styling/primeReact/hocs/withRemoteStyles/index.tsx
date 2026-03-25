import type { ComponentType } from 'react'
import StyleRegistry from '../../theme/StyleRegistry'

/**
 * Wraps a remote component with the theme StyleRegistry.
 *
 * @param RemoteComponent - Component to wrap.
 * @returns Wrapped component with theme registry.
 */
export function withRemoteStyles<P extends object>(RemoteComponent: ComponentType<P>): ComponentType<P> {
  return (props: P) => (
    <StyleRegistry>
      <RemoteComponent {...props} />
    </StyleRegistry>
  )
}
