import { CanActivate, CanActivateFn, CanDeactivate, CanDeactivateFn, Route } from '@angular/router'
import { inject, Type } from '@angular/core'
import { ActivateGuardsWrapper } from './activate-guards-wrapper.utils'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper.utils'

/**
 * Wraps the guards for a given route.
 * This function will wrap CanActivate and CanDeactivate guards and force the route to always run guards and resolvers.
 * It ensures that in a multi-router environment, the guards are properly executed.
 * @param route - The route to wrap guards for.
 *
 * This function is not going to work if:
 * - The route contains createActivateWrapper in canActivate
 * - The route contains createDeactivateWrapper in canDeactivate
 */
export function wrapGuards(route: Route) {
  console.log('wrapGuards', route)
  wrapActivateGuards(route)
  wrapDeactivateGuards(route)

  // Important, this will ensure that guards are always run
  // even if the route is already active.
  forceGuardRun(route)

  if (route.children) {
    route.children.forEach((childRoute) => wrapGuards(childRoute))
  }
}

// Create a unique symbol to tag wrapped guards
const WRAPPED_GUARD_TAG = Symbol('WrappedGuard')

function wrapActivateGuards(route: Route): void {
  if (!isGuardWrapped(route.canActivate)) {
    console.log('Wrapping activate guards for route', route)
    route.canActivate = [createActivateWrapper(route.canActivate ?? [])]
  } else {
    console.log('Activate guards are already wrapped for route', route)
  }
}

function wrapDeactivateGuards(route: Route): void {
  if (!isGuardWrapped(route.canDeactivate)) {
    console.log('Wrapping deactivate guards for route', route)
    route.canDeactivate = [createDeactivateWrapper(route.canDeactivate ?? [])]
  } else {
    console.log('Deactivate guards are already wrapped for route', route)
  }
}

/**
 * Force the route to always run guards and resolvers.
 */
function forceGuardRun(route: Route) {
  route.runGuardsAndResolvers = 'always'
}

/**
 * Helper function to check if guards are already wrapped.
 * Checks for a unique tag added to wrapped guards.
 * @param guards - The array of guards to check.
 * @returns True if the guards are wrapped, false otherwise.
 */
function isGuardWrapped(guards: Array<CanActivateFn | Type<CanActivate>> | undefined): boolean {
  if (!guards) {
    return false
  }

  return guards.some((guard) => (guard as any)?.[WRAPPED_GUARD_TAG])
}

/**
 * Creates a wrapper for CanActivate guards.
 * Adds a unique tag to the wrapped guard for identification.
 * @param guards - The array of CanActivate guards to wrap.
 * @returns A CanActivateFn that wraps the provided guards.
 */
function createActivateWrapper(guards: Array<CanActivateFn | Type<CanActivate>>): CanActivateFn {
  const wrappedGuard: CanActivateFn = (route, state) => {
    return inject(ActivateGuardsWrapper).canActivate(route, state, guards)
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
function createDeactivateWrapper(guards: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>): CanDeactivateFn<any> {
  const wrappedGuard: CanDeactivateFn<any> = (component, currentRoute, currentState, nextState) => {
    return inject(DeactivateGuardsWrapper).canDeactivate(component, currentRoute, currentState, nextState, guards)
  }

  // Tag the wrapped guard with the unique symbol
  ;(wrappedGuard as any)[WRAPPED_GUARD_TAG] = true

  return wrappedGuard
}
