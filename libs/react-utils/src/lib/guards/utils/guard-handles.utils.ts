import type { UIMatch } from 'react-router'
import type { CanActivateChildGuard, CanActivateGuard, CanDeactivateGuard, CanMatchGuard } from './guard-types.utils'

/**
 * Route handle shape for guard registration.
 */
export interface GuardsHandle {
  canMatch?: CanMatchGuard[]
  canActivate?: CanActivateGuard[]
  canActivateChild?: CanActivateChildGuard[]
  canDeactivate?: CanDeactivateGuard[]
}

/**
 * Collect guard handlers from route matches.
 * @param matches - router matches to inspect.
 * @returns aggregated guard handlers.
 */
export function getGuardsFromMatches(matches: UIMatch[]): Required<GuardsHandle> {
  const canMatch: CanMatchGuard[] = []
  const canActivate: CanActivateGuard[] = []
  const canActivateChild: CanActivateChildGuard[] = []
  const canDeactivate: CanDeactivateGuard[] = []

  matches.forEach((match) => {
    const handle = match.handle as GuardsHandle | undefined
    if (handle?.canMatch?.length) {
      canMatch.push(...handle.canMatch)
    }
    if (handle?.canActivate?.length) {
      canActivate.push(...handle.canActivate)
    }
    if (handle?.canActivateChild?.length) {
      canActivateChild.push(...handle.canActivateChild)
    }
    if (handle?.canDeactivate?.length) {
      canDeactivate.push(...handle.canDeactivate)
    }
  })

  return { canMatch, canActivate, canActivateChild, canDeactivate }
}
