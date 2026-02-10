import type { ComponentType } from 'react'
import StyleRegistry from '../../theme/StyleRegistry'

/**
 * Wraps a remote component with the theme StyleRegistry.
 */
export function withRemoteStyles<P extends object>(RemoteComponent: ComponentType<P>): ComponentType<P> {
  return (props: P) => (
    <StyleRegistry>
      <RemoteComponent {...props} />
    </StyleRegistry>
  )
}
