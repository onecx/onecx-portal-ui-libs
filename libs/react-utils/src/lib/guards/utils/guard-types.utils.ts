import type { Location, Params, UIMatch } from 'react-router'

/** Result of a guard check. */
export type GuardResult = boolean

/** Utility type for sync or async results. */
export type MaybePromise<T> = T | Promise<T>

/** Context supplied to canActivate guards. */
export interface GuardExecutionContext {
  location: Location
  params: Params
  matches: UIMatch[]
}

/** Context supplied to canDeactivate guards. */
export interface GuardDeactivationContext extends GuardExecutionContext {
  nextLocation: Location
}

/** Signature for canActivate guards. */
export type CanActivateGuard = (context: GuardExecutionContext) => MaybePromise<GuardResult>

/** Signature for canMatch guards. */
export type CanMatchGuard = (context: GuardExecutionContext) => MaybePromise<GuardResult>

/** Signature for canActivateChild guards. */
export type CanActivateChildGuard = (context: GuardExecutionContext) => MaybePromise<GuardResult>

/** Signature for canDeactivate guards. */
export type CanDeactivateGuard = (context: GuardDeactivationContext) => MaybePromise<GuardResult>
