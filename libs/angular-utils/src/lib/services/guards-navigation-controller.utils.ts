import { Injectable } from '@angular/core'
import { GUARD_CHECK } from '../model/guard-check.model'
import { GuardsNavigationState, IS_ROUTER_SYNC } from '../model/guard-navigation.model'

/**
 * GuardsNavigationController is a service that manages the navigation state for guards.
 */
@Injectable({ providedIn: 'any' })
export class GuardsNavigationStateController {
  createActivationCheckState(): GuardsNavigationState {
    return { [GUARD_CHECK.ACTIVATE]: true }
  }

  createDeactivationCheckState(): GuardsNavigationState {
    return { [GUARD_CHECK.DEACTIVATE]: true }
  }

  createRouterSyncState(): GuardsNavigationState {
    return { [IS_ROUTER_SYNC]: true }
  }

  isRouterSyncState(state: GuardsNavigationState): boolean {
    return IS_ROUTER_SYNC in state && state[IS_ROUTER_SYNC] === true
  }

  isActivateCheckState(state: GuardsNavigationState): boolean {
    return GUARD_CHECK.ACTIVATE in state && state[GUARD_CHECK.ACTIVATE] === true
  }

  isDeactivateCheckState(state: GuardsNavigationState): boolean {
    return GUARD_CHECK.DEACTIVATE in state && state[GUARD_CHECK.DEACTIVATE] === true
  }

  isDeactivationChecksCompleted(state: GuardsNavigationState): boolean {
    return 'deactivateChecksCompleted' in state && state['deactivateChecksCompleted'] === true
  }

  setDeactivationChecksCompleted(state: GuardsNavigationState): void {
    state['deactivateChecksCompleted'] = true
  }
}
