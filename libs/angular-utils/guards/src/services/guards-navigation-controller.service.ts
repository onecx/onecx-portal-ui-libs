import { Injectable } from '@angular/core'
import {
  GUARD_CHECK,
  GUARD_CHECK_PROMISE,
  GUARD_MODE,
  GuardCheckPromise,
  GuardsNavigationState,
  IS_INITIAL_ROUTER_SYNC,
  IS_ROUTER_SYNC,
} from '../model/guard-navigation.model'

/**
 * GuardsNavigationController is a service that manages the navigation state for guards.
 */
@Injectable({ providedIn: 'any' })
export class GuardsNavigationStateController {
  /**
   * Retrieves the current mode of the guards navigation state.
   * @param guardsNavigationState - the GuardsNavigationState to check
   * @returns GUARD_MODE indicating the current mode of the guards navigation state
   */
  getMode(guardsNavigationState: GuardsNavigationState): GUARD_MODE {
    if (guardsNavigationState[IS_INITIAL_ROUTER_SYNC]) {
      return GUARD_MODE.INITIAL_ROUTER_SYNC
    }

    if (guardsNavigationState[IS_ROUTER_SYNC]) {
      return GUARD_MODE.ROUTER_SYNC
    }

    if (guardsNavigationState[GUARD_CHECK]) {
      return GUARD_MODE.GUARD_CHECK
    }

    return GUARD_MODE.NAVIGATION_REQUESTED
  }

  /**
   * Creates an initial router sync state for guards navigation.
   * @param guardsNavigationState - optional GuardsNavigationState to modify
   * @returns GuardsNavigationState with initial router sync state
   */
  createInitialRouterSyncState(guardsNavigationState?: GuardsNavigationState): GuardsNavigationState {
    if (guardsNavigationState) {
      guardsNavigationState[IS_ROUTER_SYNC] = true
      guardsNavigationState[IS_INITIAL_ROUTER_SYNC] = true
      return guardsNavigationState
    }

    return {
      [IS_ROUTER_SYNC]: true,
      [IS_INITIAL_ROUTER_SYNC]: true,
    }
  }

  /**
   * Creates a router sync state for guards navigation.
   * @param guardsNavigationState - optional GuardsNavigationState to modify
   * @returns GuardsNavigationState with router sync state
   */
  createGuardCheckState(guardsNavigationState?: GuardsNavigationState): GuardsNavigationState {
    if (guardsNavigationState) {
      guardsNavigationState[GUARD_CHECK] = true
      return guardsNavigationState
    }

    return { [GUARD_CHECK]: true }
  }

  /**
   * Creates a navigation requested state for guards navigation.
   * @param guardsCheckPromise - the promise to resolve guard checks
   * @param guardsNavigationState - optional GuardsNavigationState to modify
   * @returns GuardsNavigationState with navigation requested state
   */
  createNavigationRequestedState(
    guardsCheckPromise: GuardCheckPromise,
    guardsNavigationState?: GuardsNavigationState
  ): GuardsNavigationState {
    if (guardsNavigationState) {
      guardsNavigationState[GUARD_CHECK_PROMISE] = guardsCheckPromise
      return guardsNavigationState
    }

    return { [GUARD_CHECK_PROMISE]: guardsCheckPromise }
  }

  /**
   * Retrieves the GuardCheckPromise from the provided GuardsNavigationState.
   * @param state - the GuardsNavigationState to check
   * @returns GuardCheckPromise if it exists, undefined otherwise
   */
  getGuardCheckPromise(state: GuardsNavigationState): GuardCheckPromise | undefined {
    return state[GUARD_CHECK_PROMISE]
  }
}
