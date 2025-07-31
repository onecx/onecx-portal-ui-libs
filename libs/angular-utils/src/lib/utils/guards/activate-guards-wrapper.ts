import { inject, Injectable, Injector, Type } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  RedirectCommand,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { GuardsWrapper } from './guards-wrapper'
import { GUARD_CHECK, GuardsGatherer } from './guards-gatherer'

@Injectable({ providedIn: 'root' })
export class ActivateGuardsWrapper extends GuardsWrapper {
  private injector = inject(Injector)
  private guardsGatherer = inject(GuardsGatherer)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>
  ): MaybeAsync<GuardResult> {
    const navigationState = this.router.getCurrentNavigation()?.extras.state ?? {}
    const currentUrl = state.url
    const futureUrl = this.getUrlFromSnapshot(route)
    console.log('Performing canActivate for', route, navigationState)

    if ('isRouterSync' in navigationState && navigationState['isRouterSync']) {
      // Important to make sure all guarded functionality is executed
      return this.executeActivateGuards(route, state, guards, this.combineToBoolean).then(() =>
        this.executeRouterSyncGuard()
      )
    }

    if (GUARD_CHECK.ACTIVATE in navigationState && navigationState[GUARD_CHECK.ACTIVATE]) {
      console.log(
        'Activate check requested, returning false for activate checks and resolving promise with guards results.'
      )
      const myGuardsResult = this.executeActivateGuards(route, state, guards, this.combineToBoolean)
      return myGuardsResult.then((result) => {
        this.guardsGatherer.resolveRouteActivate(futureUrl, result)

        // Important to return false so navigation does not happen
        return false
      })
    }

    // Special case when activation checks are running when deactivation were requested
    // If deactivation check is processed in CanActivate, we should return true
    // to allow the navigation to proceed, since we have nothing to deactivate
    if (GUARD_CHECK.DEACTIVATE in navigationState && navigationState[GUARD_CHECK.DEACTIVATE]) {
      console.log(
        'Deactivate check requested while resolving canActivate, returning true since no active route exists.'
      )

      this.guardsGatherer.resolveRouteDeactivate(currentUrl, true)
      // Important to return false so navigation does not happen
      return false
    }

    return this.executeScatteredActivateGuard(route, state, guards)
  }

  private executeActivateGuards<T extends boolean | GuardResult>(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>,
    combineFn: (results: GuardResult[]) => T
  ): Promise<T> {
    if (!route.routeConfig) {
      console.warn('No route configuration found for canActivate guard.')
      return Promise.resolve(true as T)
    }

    const canActivateFunctions = guards.map((guard) => this.mapActivateGuardToFunctionReturningPromise(guard))

    const canActivateResults = Promise.all(canActivateFunctions.map((fn) => fn(route, state)))
    return canActivateResults.then((results) => combineFn(results))
  }

  private executeScatteredActivateGuard(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>
  ) {
    console.log('Performing scattered activate guard after running my own guards', route, state)
    const myGuardsResult = this.executeActivateGuards(route, state, guards, this.combineToGuardResult)

    return myGuardsResult.then((result) => {
      // For redirect return immediately to perform redirect
      if (myGuardsResult instanceof UrlTree || myGuardsResult instanceof RedirectCommand) {
        console.log('Was UrlTree or RedirectCommand, returning it.')
        return myGuardsResult
      }
      // For false don't ask others since we don't agree
      if (result === false) {
        console.log('Route is guarded.')
        return result
      }

      console.log('Will gather activate from others for route', route)
      return this.guardsGatherer
        .gatherActivate({ url: this.getUrlFromSnapshot(route) })
        .then((results) => Array.isArray(results) && this.combineToBoolean(results))
        .then((result) => {
          console.log('Scattered activate guard result:', result)
          return result
        })
    })
  }

  private mapActivateGuardToFunctionReturningPromise(
    guard: Type<CanActivate> | CanActivateFn
  ): (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Promise<GuardResult> {
    if (this.isCanActivateClassBasedGuard(guard)) {
      // guard for CanActivate is not a guard instance but class definition
      const guardInstance = this.injector.get(guard)
      return (route, state) => this.resolveToPromise(guardInstance.canActivate(route, state))
    } else if (typeof guard === 'function') {
      return (route, state) => this.resolveToPromise(guard(route, state))
    }

    console.warn('Guard does not implement canActivate:', guard)
    return () => Promise.resolve(true)
  }

  private isCanActivateClassBasedGuard(guard: Type<CanActivate> | CanActivateFn): guard is Type<CanActivate> {
    return typeof guard === 'function' && guard.prototype && 'canActivate' in guard.prototype
  }
}
