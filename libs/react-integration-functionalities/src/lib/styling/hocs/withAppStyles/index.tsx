import type { ComponentType } from 'react'
import StyleRegistry from '../../theme/StyleRegistry'

/**
 * Wraps a component with the theme StyleRegistry.
 */
export function withAppStyles<P extends object>(Component: ComponentType<P>): ComponentType<P> {
  return (props: P) => (
    <StyleRegistry>
      <Component {...props} />
    </StyleRegistry>
  )
}
