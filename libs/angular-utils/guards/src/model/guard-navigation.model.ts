/**
 * Scattered guards navigation state model.
 * Used to check if the guard checks are requested in the navigation state by different application.
 * This is used to perform guard checks without navigating.
 */
export interface GuardsNavigationState {
  [IS_ROUTER_SYNC]?: boolean
  [IS_INITIAL_ROUTER_SYNC]?: boolean
  [GUARD_CHECK]?: boolean
  [GUARD_CHECK_PROMISE]?: GuardCheckPromise
}

export type GuardCheckPromise = Promise<boolean>

/**
 * Indicates that the router is in sync mode.
 */
export const IS_ROUTER_SYNC = 'isRouterSync'

/**
 * Indicates that the router is in initial sync mode.
 */
export const IS_INITIAL_ROUTER_SYNC = 'isInitialRouterSync'

/**
 * Indicates that the guard check is requested.
 */
export const GUARD_CHECK = 'guardCheck'

/**
 * Indicates that the guard check promise was requested by this application.
 * This is used to wait for the external guard checks to be completed before proceeding with the navigation.
 */
export const GUARD_CHECK_PROMISE = 'guardCheckPromise'

export enum GUARD_MODE {
  INITIAL_ROUTER_SYNC = 'initialRouterSync',
  ROUTER_SYNC = 'routerSync',
  GUARD_CHECK = 'guardCheck',
  NAVIGATION_REQUESTED = 'navigationRequested',
}
