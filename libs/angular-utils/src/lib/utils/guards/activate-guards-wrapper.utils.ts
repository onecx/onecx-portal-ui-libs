import { inject, Injectable, Injector, Type } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  RedirectCommand,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { GuardsWrapper } from './guards-wrapper.utils'
import { GuardsGatherer } from '../../services/guards-gatherer.service'
import { GuardsNavigationState } from '../../model/guard-check.model'
import { GuardsNavigationStateController } from '../../services/guards-navigation-controller.utils'

/**
 * Wrapper for CanActivate guards that allows to gather activation results
 * and handle special cases like router sync or scattered guards.
 *
 * It performs the activation checks in different scenarios based on the navigation state:
 * - If the navigation state indicates a router sync, it immediately agrees for the navigation.
 * - If the navigation state requests an activation check, it performs the activation guards checks
 *   and resolves the promise with the results while not allowing the navigation to proceed.
 * - If the navigation state requests a deactivation check, it resolves the promise with true
 *   to allow activation checks to proceed, since no active route exists.
 *   and returns true to allow activation checks to proceed.
 * - If no special cases are detected, it executes scattered activation guards and gathers results.
 */
@Injectable({ providedIn: 'root' })
export class ActivateGuardsWrapper extends GuardsWrapper {
  private injector = inject(Injector)
  private guardsGatherer = inject(GuardsGatherer)
  protected router = inject(Router)
  private guardsNavigationStateController = inject(GuardsNavigationStateController)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>
  ): MaybeAsync<GuardResult> {
    const guardsNavigationState = this.router.getCurrentNavigation()?.extras.state ?? ({} as GuardsNavigationState)
    const currentUrl = state.url
    const futureUrl = this.getUrlFromSnapshot(route)
    console.log('Performing canActivate for', route, guardsNavigationState)

    if (this.guardsNavigationStateController.isRouterSyncState(guardsNavigationState)) {
      // Important to make sure all guarded functionality is executed
      return this.executeActivateGuards(route, state, guards, this.combineToBoolean).then(() =>
        this.executeRouterSyncGuard()
      )
    }

    if (this.guardsNavigationStateController.isActivateCheckState(guardsNavigationState)) {
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
    if (this.guardsNavigationStateController.isDeactivateCheckState(guardsNavigationState)) {
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
