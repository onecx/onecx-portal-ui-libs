import type { Location } from 'react-router'
import type { WrappedGuards } from '../utils/wrap-guards.utils'

/** Result returned by the guards a deactivation spec does not exercise. */
async function allow(): Promise<boolean> {
  return true
}

/**
 * Build a Location for guard-deactivation specs.
 * @param key - navigation key of the location.
 * @returns location object with a constant path and the given key.
 */
export function location(key: string): Location {
  return { pathname: '/', search: '', hash: '', state: null, key }
}

/**
 * Build a WrappedGuards object whose canDeactivate is the given check.
 * @param canDeactivate - deactivation check to expose; the other guards always allow.
 * @returns wrapped guards whose canDeactivate delegates to the given check.
 */
export function makeWrappedGuards(canDeactivate: () => Promise<boolean>): WrappedGuards {
  return {
    canMatch: allow,
    canActivateChild: allow,
    canActivate: allow,
    canDeactivate,
    guards: { canMatch: [], canActivateChild: [], canActivate: [], canDeactivate: [] },
  }
}
