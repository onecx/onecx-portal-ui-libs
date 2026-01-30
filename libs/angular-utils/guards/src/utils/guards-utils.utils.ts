import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RedirectCommand, UrlTree } from '@angular/router'
import { isObservable, lastValueFrom } from 'rxjs'
import '../declarations'
import { createLogger } from './logger.utils'

window['@onecx/angular-utils'] = window['@onecx/angular-utils'] || {}

/**
 * Logs debug information for Guards.
 * It checks if the debug mode is enabled and logs the provided arguments.
 * This is useful for debugging guard checks and navigation state.
 * @param args - the arguments to log
 */
export function logGuardsDebug(...args: any[]): void {
  createLogger('guards-utils').debug('Guards:', ...args)
}

/**
 * Execute router sync operation.
 * Immediately returns true to indicate that the operation was successful.
 */
export function executeRouterSyncGuard(): boolean {
  logGuardsDebug('Was RouterSync, returning true.')

  // Important to return true because it was already agreed to perform navigation in the application
  return true
}

/**
 * Returns false if any guard returned false.
 * Returns UrTree or RedirectCommand if any guard returned this value type (the first value is returned).
 * Else it returns true.
 */
export function combineToGuardResult(results: GuardResult[]): GuardResult {
  if (results.some((result) => result === false)) {
    return false
  }

  // Check for UrlTree or RedirectCommand
  // If any guard returned this, we need to return it to perform the redirection
  // We return the first one found
  const redirectResult = results.find((result) => result instanceof UrlTree || result instanceof RedirectCommand)
  if (redirectResult) {
    return redirectResult
  }

  return true
}

/**
 * Returns false if any guard returned false.
 * Else it returns true.
 */
export function combineToBoolean(results: GuardResult[]): boolean {
  if (results.some((result) => result === false)) {
    return false
  }

  return true
}

/**
 * Resolves MaybeAsync to Promise.
 * @param maybeAsync - the value to resolve
 * @returns Promise<GuardResult>
 */
export function resolveToPromise(maybeAsync: MaybeAsync<GuardResult>): Promise<GuardResult> {
  if (maybeAsync instanceof Promise) {
    return maybeAsync
  } else if (isObservable(maybeAsync)) {
    return lastValueFrom(maybeAsync)
  }

  return Promise.resolve(maybeAsync)
}

/**
 * Gets the URL from the ActivatedRouteSnapshot.
 * @param route - the route to get URL from
 * @returns string - the URL of the route
 */
export function getUrlFromSnapshot(route: ActivatedRouteSnapshot): string {
  const segments: string[] = []

  let currentRoute: ActivatedRouteSnapshot | null = route
  while (currentRoute) {
    segments.unshift(...currentRoute.url.map((segment) => segment.path))
    currentRoute = currentRoute.parent
  }

  return segments.join('/')
}
