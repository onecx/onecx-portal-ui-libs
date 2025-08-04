import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RedirectCommand, Router, UrlTree } from '@angular/router'
import { isObservable, lastValueFrom } from 'rxjs'

export class GuardsWrapper {
  /**
   * Execute router sync operation.
   * Immediately returns true to indicate that the operation was successful.
   */
  protected executeRouterSyncGuard() {
    console.log('Was RouterSync, returning true.')

    // Important to return true because it was already agreed to perform navigation in the application
    return true
  }

  /**
   * Returns false if any guard returned false.
   * Returns UrTree or RedirectCommand if any guard returned this value type (the first value is returned).
   * Else it returns true.
   */
  protected combineToGuardResult(results: GuardResult[]): GuardResult {
    if (results.some((result) => result === false)) {
      return false
    }

    const redirectResult = results.find((result) => result instanceof UrlTree || result instanceof RedirectCommand)
    if (redirectResult) {
      return redirectResult
    }

    return true
  }

  /**
   * Returns false if any guard returned false or UrTree or RedirectCommand.
   * Else it returns true.
   */
  protected combineToBoolean(results: GuardResult[]): boolean {
    if (results.some((result) => result === false)) {
      return false
    }

    const redirectResult = results.find((result) => result instanceof UrlTree || result instanceof RedirectCommand)
    if (redirectResult) {
      return false
    }

    return true
  }

  /**
   * Resolves MaybeAsync to Promise.
   * @param maybeAsync - the value to resolve
   * @returns Promise<GuardResult>
   */
  protected resolveToPromise(maybeAsync: MaybeAsync<GuardResult>): Promise<GuardResult> {
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
  protected getUrlFromSnapshot(route: ActivatedRouteSnapshot): string {
    const segments: string[] = []

    let currentRoute: ActivatedRouteSnapshot | null = route
    while (currentRoute) {
      segments.unshift(...currentRoute.url.map((segment) => segment.path))
      currentRoute = currentRoute.parent
    }

    return segments.join('/')
  }
}
