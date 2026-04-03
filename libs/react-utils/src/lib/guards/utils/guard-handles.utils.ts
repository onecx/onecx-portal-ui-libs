import type { UIMatch } from 'react-router'
import type { CanActivateGuard, CanDeactivateGuard } from './guard-types.utils'

/**
 * Route handle shape for guard registration.
 */
export interface GuardsHandle {
  canActivate?: CanActivateGuard[]
  canDeactivate?: CanDeactivateGuard[]
}

/**
 * Collect guard handlers from route matches.
 * @param matches - router matches to inspect.
 * @returns aggregated guard handlers.
 */
export function getGuardsFromMatches(matches: UIMatch[]): Required<GuardsHandle> {
  const canActivate: CanActivateGuard[] = []
  const canDeactivate: CanDeactivateGuard[] = []

  matches.forEach((match) => {
    const handle = match.handle as GuardsHandle | undefined
    if (handle?.canActivate?.length) {
      canActivate.push(...handle.canActivate)
    }
    if (handle?.canDeactivate?.length) {
      canDeactivate.push(...handle.canDeactivate)
    }
  })

  return { canActivate, canDeactivate }
}
