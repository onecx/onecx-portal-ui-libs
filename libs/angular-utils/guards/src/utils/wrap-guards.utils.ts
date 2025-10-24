import { CanActivate, CanActivateFn, CanDeactivate, CanDeactivateFn, Route } from '@angular/router'
import { inject, Type } from '@angular/core'
import { ActivateGuardsWrapper } from './activate-guards-wrapper.utils'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper.utils'
import { logGuardsDebug } from './guards-utils.utils'

/**
 * Extended Route interface to hold original guards.
 * This interface extends the Angular Route interface to include lists for original guards.
 */
export interface OnecxRoute extends Route {
  canActivateGuardList?: Array<CanActivateFn | Type<CanActivate>>
  canDeactivateGuardList?: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>
  canActivateChildGuardList?: Array<CanActivateFn | Type<CanActivate>>
}

// Create a unique symbol to tag wrapped guards
export const WRAPPED_GUARD_TAG = Symbol('WrappedGuard')

/**
 * Wraps the guards for a given route.
 * This function will wrap CanActivate, CanDeactivate and CanActivateChild guards and force the route to always run guards and resolvers.
 * It ensures that in a multi-router environment, the guards are properly executed.
 * @param route - The route to wrap guards for.
 */
export function wrapGuards(route: Route) {
  logGuardsDebug('wrapGuards', route)
  saveOriginalGuards(route as OnecxRoute)
  wrapActivateGuards(route)
  wrapDeactivateGuards(route)
  wrapActivateChildGuards(route)

  // Important, this will ensure that guards are always run
  // even if the route is already active.
  forceGuardRun(route)

  if (route.children) {
    route.children.forEach((childRoute) => wrapGuards(childRoute))
  }
}

function wrapActivateGuards(route: Route): void {
  if (isWrappingRequired(route.canActivate)) {
    logGuardsDebug('Wrapping activate guards for route', route)
    route.canActivate = [createActivateWrapper(route)]
  }
}

function wrapDeactivateGuards(route: Route): void {
  if (isWrappingRequired(route.canDeactivate)) {
    logGuardsDebug('Wrapping deactivate guards for route', route)
    route.canDeactivate = [createDeactivateWrapper(route)]
  }
}

function wrapActivateChildGuards(route: Route): void {
  if (isWrappingRequired(route.canActivateChild)) {
    logGuardsDebug('Wrapping activate child guards for route', route)
    route.canActivateChild = [createActivateChildWrapper(route)]
  }
}

/**
 * Force the route to always run guards and resolvers.
 */
function forceGuardRun(route: Route) {
  route.runGuardsAndResolvers = 'always'
}

/**
 * Saves the state of the guards for the route.
 * This function saves the canActivate, canDeactivate, and canActivateChild guards to their respective lists.
 * @param route - The route to save the guard state for.
 */
function saveOriginalGuards(route: OnecxRoute) {
  saveCanActivateGuards(route)
  saveCanDeactivateGuards(route)
  saveCanActivateChildGuards(route)
}

/**
 * Checks if wrapping is required for the guards.
 * If the guards array has only one guard and it is already wrapped, no wrapping is needed.
 * @param guards - The array of guards to check.
 * @returns True if wrapping is required, false otherwise.
 */
function isWrappingRequired(guards: Array<any> | undefined): boolean {
  if (guards && guards.length === 1 && isGuardsWrapped(guards)) {
    return false
  }

  return true
}

/**
 * Helper function to check if guards are already wrapped.
 * Checks for a unique tag added to wrapped guards.
 * @param guards - The array of guards to check.
 * @returns True if the guards are wrapped, false otherwise.
 */
function isGuardsWrapped(guards: Array<any>): boolean {
  return guards.some((guard) => isWrapper(guard))
}

/**
 * Checks if a guard is a wrapper.
 * A guard is considered a wrapper if it has the unique WRAPPED_GUARD_TAG symbol.
 * @param guard - The guard to check.
 * @returns True if the guard is a wrapper, false otherwise.
 */
function isWrapper(guard: any): boolean {
  return guard && (guard as any)[WRAPPED_GUARD_TAG] === true
}

/**
 * Creates a wrapper for CanActivate guards.
 * Adds a unique tag to the wrapped guard for identification.
 * @param guards - The array of CanActivate guards to wrap.
 * @returns A CanActivateFn that wraps the provided guards.
 */
function createActivateWrapper(routeToWrap: OnecxRoute): CanActivateFn {
  const wrappedGuard: CanActivateFn = (route, state) => {
    return inject(ActivateGuardsWrapper).canActivate(route, state, routeToWrap.canActivateGuardList || [])
  }

  // Tag the wrapped guard with the unique symbol
  ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true

  return wrappedGuard
}

/**
 * Creates a wrapper for CanDeactivate guards.
 * @param guards - The array of CanDeactivate guards to wrap.
 * @returns A CanDeactivateFn that wraps the provided guards.
 */
function createDeactivateWrapper(routeToWrap: OnecxRoute): CanDeactivateFn<any> {
  const wrappedGuard: CanDeactivateFn<any> = (component, currentRoute, currentState, nextState) => {
    return inject(DeactivateGuardsWrapper).canDeactivate(
      component,
      currentRoute,
      currentState,
      nextState,
      routeToWrap.canDeactivateGuardList || []
    )
  }

  // Tag the wrapped guard with the unique symbol
  ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true

  return wrappedGuard
}

/**
 * Creates a wrapper for CanActivateChild guards.
 * Adds a unique tag to the wrapped guard for identification.
 * @param guards - The array of CanActivateChild guards to wrap.
 * @returns A CanActivateFn that wraps the provided guards.
 */
function createActivateChildWrapper(routeToWrap: OnecxRoute): CanActivateFn {
  const wrappedGuard: CanActivateFn = (route, state) => {
    return inject(ActivateGuardsWrapper).canActivate(route, state, routeToWrap.canActivateChildGuardList || [])
  }

  // Tag the wrapped guard with the unique symbol
  ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true

  return wrappedGuard
}

/**
 * Saves the canActivate guards to the route's canActivateGuardList.
 * @param route - The route to save the canActivate guards for.
 */
function saveCanActivateGuards(route: OnecxRoute): void {
  if (!route.canActivateGuardList) route.canActivateGuardList = []

  if (route.canActivate) {
    route.canActivateGuardList = route.canActivateGuardList.concat(
      route.canActivate.filter(
        (guard) => !isWrapper(guard) && !isSaved<CanActivateFn | Type<CanActivate>>(route.canActivateGuardList!, guard)
      )
    )
  }
}

/**
 * Saves the canActivateChild guards to the route's canActivateChildGuardList.
 * @param route - The route to save the canActivateChild guards for.
 */
function saveCanDeactivateGuards(route: OnecxRoute): void {
  if (!route.canDeactivateGuardList) route.canDeactivateGuardList = []

  if (route.canDeactivate) {
    route.canDeactivateGuardList = route.canDeactivateGuardList.concat(
      route.canDeactivate.filter(
        (guard) =>
          !isWrapper(guard) &&
          !isSaved<CanDeactivateFn<any> | Type<CanDeactivate<any>>>(route.canDeactivateGuardList!, guard)
      )
    )
  }
}

/**
 * Saves the canActivateChild guards to the route's canActivateChildGuardList.
 * @param route - The route to save the canActivateChild guards for.
 */
function saveCanActivateChildGuards(route: OnecxRoute): void {
  if (!route.canActivateChildGuardList) route.canActivateChildGuardList = []

  if (route.canActivateChild) {
    route.canActivateChildGuardList = route.canActivateChildGuardList.concat(
      route.canActivateChild.filter(
        (guard) =>
          !isWrapper(guard) && !isSaved<CanActivateFn | Type<CanActivate>>(route.canActivateChildGuardList!, guard)
      )
    )
  }
}

function isSaved<T>(list: Array<T>, guard: T) {
  return list.some((item) => item === guard)
}
