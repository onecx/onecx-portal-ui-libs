import type { Location, UIMatch } from 'react-router'
import { getGuardsFromMatches } from './guard-handles.utils'
import type {
  CanActivateChildGuard,
  CanActivateGuard,
  CanDeactivateGuard,
  CanMatchGuard,
  GuardExecutionContext,
  GuardResult,
} from './guard-types.utils'
import type { GuardsNavigationState } from '../model/guard-navigation.model'
import { GuardsGatherer } from '../services/guards-gatherer'
import { GuardsNavigationStateController } from '../services/guards-navigation-controller'
import { ActivateGuardsWrapper } from './activate-guards-wrapper.utils'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper.utils'

/** Options to build guard wrappers for current route matches. */
export interface WrapGuardsOptions {
  matches: UIMatch[]
  location: Location
  guardsNavigationState?: GuardsNavigationState
  guardsGatherer?: GuardsGatherer
  guardsNavigationStateController?: GuardsNavigationStateController
}

/** Result of wrapGuards containing executors and collected guards. */
export interface WrappedGuards {
  canMatch: () => Promise<GuardResult>
  canActivateChild: () => Promise<GuardResult>
  canActivate: () => Promise<GuardResult>
  canDeactivate: (nextLocation: Location) => Promise<GuardResult>
  guards: {
    canMatch: CanMatchGuard[]
    canActivate: CanActivateGuard[]
    canActivateChild: CanActivateChildGuard[]
    canDeactivate: CanDeactivateGuard[]
  }
}

/**
 * Wrap route guards and expose canActivate/canDeactivate helpers.
 * @param options - wrap options containing matches and state.
 * @returns wrapped guard helpers.
 */
export function wrapGuards(options: WrapGuardsOptions): WrappedGuards {
  const { matches, location, guardsNavigationState, guardsGatherer, guardsNavigationStateController } = options
  const guards = getGuardsFromMatches(matches)

  const activateWrapper = new ActivateGuardsWrapper(guardsGatherer, guardsNavigationStateController)
  const deactivateWrapper = new DeactivateGuardsWrapper(guardsGatherer, guardsNavigationStateController)

  return {
    guards,
    canMatch: async () =>
      activateWrapper.canActivate(buildContext(matches, location), guards.canMatch, guardsNavigationState),
    canActivateChild: async () =>
      activateWrapper.canActivate(buildContext(matches, location), guards.canActivateChild, guardsNavigationState),
    canActivate: async () =>
      activateWrapper.canActivate(buildContext(matches, location), guards.canActivate, guardsNavigationState),
    canDeactivate: async (nextLocation) =>
      deactivateWrapper.canDeactivate(
        { ...buildContext(matches, location), nextLocation },
        guards.canDeactivate,
        guardsNavigationState
      ),
  }
}

function buildContext(matches: UIMatch[], location: Location): GuardExecutionContext {
  const lastMatch = matches[matches.length - 1]
  return {
    location,
    params: lastMatch?.params ?? {},
    matches,
  }
}
