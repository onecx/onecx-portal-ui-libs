import { Injectable } from '@angular/core'
import {
  GUARD_CHECK,
  GUARD_CHECK_PROMISE,
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
   * Adds a GuardCheckPromise to the provided GuardsNavigationState.
   * @param state - the GuardsNavigationState to modify
   * @param guardCheckPromise - the GuardCheckPromise to add
   * */
  createGuardCheckPromise(state: GuardsNavigationState, guardCheckPromise: GuardCheckPromise): void {
    state[GUARD_CHECK_PROMISE] = guardCheckPromise
  }

  /**
   * Creates a GuardsNavigationState that indicates a guard check is requested.
   * @returns GuardsNavigationState with the guard check request
   */
  createGuardCheck(): GuardsNavigationState {
    return { [GUARD_CHECK]: true }
  }

  /**
   * Retrieves the GuardCheckPromise from the provided GuardsNavigationState.
   * @param state - the GuardsNavigationState to check
   * @returns GuardCheckPromise if it exists, undefined otherwise
   */
  getGuardCheckPromise(state: GuardsNavigationState): GuardCheckPromise | undefined {
    return state[GUARD_CHECK_PROMISE]
  }

  /**
   * Checks if the provided GuardsNavigationState indicates that the router is in sync mode.
   * @param state - the GuardsNavigationState to check
   * @returns true if the state indicates a router sync, false otherwise
   */
  isRouterSyncState(state: GuardsNavigationState): boolean {
    return IS_ROUTER_SYNC in state && state[IS_ROUTER_SYNC] === true
  }

  /**
   * Checks if the provided GuardsNavigationState indicates that the router is in initial sync mode.
   * @param state - the GuardsNavigationState to check
   * @returns true if the state indicates an initial router sync, false otherwise
   */
  isInitialRouterSyncState(state: GuardsNavigationState): boolean {
    return IS_INITIAL_ROUTER_SYNC in state && state[IS_INITIAL_ROUTER_SYNC] === true
  }

  /**
   * Checks if the provided GuardsNavigationState indicates that a guard check is requested.
   * @param state - the GuardsNavigationState to check
   * @returns true if the state indicates a guard check, false otherwise
   */
  isGuardCheckState(state: GuardsNavigationState): boolean {
    return GUARD_CHECK in state && state[GUARD_CHECK] === true
  }
}
