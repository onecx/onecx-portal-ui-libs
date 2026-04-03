import {
  GUARD_CHECK,
  GUARD_CHECK_KEY,
  GUARD_CHECK_PROMISE,
  GUARD_MODE,
  GuardCheckPromise,
  GuardsNavigationState,
  IS_INITIAL_ROUTER_SYNC,
  IS_ROUTER_SYNC,
} from '../model/guard-navigation.model'

/**
 * Manages navigation state flags used to coordinate guard checks.
 */
export class GuardsNavigationStateController {
  /**
   * Determine the guard mode based on navigation state flags.
   * @param guardsNavigationState - current navigation state.
   * @returns detected guard mode.
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
   * Create or update state marking initial router sync.
   * @param guardsNavigationState - existing state to mutate.
   * @returns updated navigation state.
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
   * Create or update state marking a guard check request.
   * @param guardsNavigationState - existing state to mutate.
   * @param guardCheckKey - optional key to force re-processing.
   * @returns updated navigation state.
   */
  createGuardCheckState(guardsNavigationState?: GuardsNavigationState, guardCheckKey?: string): GuardsNavigationState {
    if (guardsNavigationState) {
      guardsNavigationState[GUARD_CHECK] = true
      if (guardCheckKey) {
        guardsNavigationState[GUARD_CHECK_KEY] = guardCheckKey
      }
      return guardsNavigationState
    }

    return guardCheckKey ? { [GUARD_CHECK]: true, [GUARD_CHECK_KEY]: guardCheckKey } : { [GUARD_CHECK]: true }
  }

  /**
   * Create or update state marking navigation request with a guard check promise.
   * @param guardsCheckPromise - promise representing guard checks.
   * @param guardsNavigationState - existing state to mutate.
   * @returns updated navigation state.
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
   * Extract guard check promise from navigation state.
   * @param state - navigation state to read.
   * @returns guard check promise if present.
   */
  getGuardCheckPromise(state: GuardsNavigationState): GuardCheckPromise | undefined {
    return state[GUARD_CHECK_PROMISE]
  }
}
