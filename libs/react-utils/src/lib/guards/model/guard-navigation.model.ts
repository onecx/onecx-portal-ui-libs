/**
 * Navigation state flags used to coordinate guard execution between routers/apps.
 */
export interface GuardsNavigationState {
  [IS_ROUTER_SYNC]?: boolean
  [IS_INITIAL_ROUTER_SYNC]?: boolean
  [GUARD_CHECK]?: boolean
  [GUARD_CHECK_KEY]?: string
  [GUARD_CHECK_PROMISE]?: GuardCheckPromise
}

/**
 * Promise used to synchronize guard checks between navigation requests.
 */
export type GuardCheckPromise = Promise<boolean>

/** Indicates that the router is in sync mode. */
export const IS_ROUTER_SYNC = 'isRouterSync'
/** Indicates that the router is in initial sync mode. */
export const IS_INITIAL_ROUTER_SYNC = 'isInitialRouterSync'
/** Indicates that a guard check is being requested. */
export const GUARD_CHECK = 'guardCheck'
/** Unique key to force re-processing of a guard check on the same URL. */
export const GUARD_CHECK_KEY = 'guardCheckKey'
/** Indicates that the guard check promise was requested by this app. */
export const GUARD_CHECK_PROMISE = 'guardCheckPromise'

/**
 * Supported guard navigation modes.
 */
export const GUARD_MODE = {
  INITIAL_ROUTER_SYNC: 'initialRouterSync',
  ROUTER_SYNC: 'routerSync',
  GUARD_CHECK: 'guardCheck',
  NAVIGATION_REQUESTED: 'navigationRequested',
} as const

export type GuardMode = (typeof GUARD_MODE)[keyof typeof GUARD_MODE]
