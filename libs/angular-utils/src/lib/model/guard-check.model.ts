/**
 * Scattered guards navigation state model.
 * Used to check if the guard checks are requested in the navigation state by different application.
 * This is used to perform guard checks without navigating.
 */
export interface GuardsNavigationState extends Record<string, any> {
  [IS_ROUTER_SYNC]?: boolean
  [GUARD_CHECK.ACTIVATE]?: boolean
  [GUARD_CHECK.DEACTIVATE]?: boolean
  [DEACTIVATE_CHECKS_COMPLETED]?: boolean
}

/**
 * Indicates that the router is in sync mode.
 */
export const IS_ROUTER_SYNC = 'isRouterSync'

/**
 * Indicates that the deactivate checks were completed.
 */
export const DEACTIVATE_CHECKS_COMPLETED = 'deactivateChecksCompleted'

/**
 * Router state guard check model.
 * Used to check if the guard checks are requested in the navigation state by different application.
 * This is used to perform guard checks without navigating.
 * It is expected that the guards wrappers will use this information to perform checks without navigating.
 */
export enum GUARD_CHECK {
  ACTIVATE = 'activateGuardCheckRequest',
  DEACTIVATE = 'deactivateGuardCheckRequest',
}
