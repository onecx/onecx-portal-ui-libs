import { inject, Injectable, Injector, Type } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { GuardsGatherer } from '../../services/guards-gatherer.service'
import { GuardsNavigationStateController } from '../../services/guards-navigation-controller.utils'
import { GuardsNavigationState } from '../../model/guard-navigation.model'
import {
  combineToBoolean,
  combineToGuardResult,
  executeRouterSyncGuard,
  getUrlFromSnapshot,
  resolveToPromise,
} from './guards-utils.utils'

/**
 * Wrapper for canActivate guards that handles the navigation state and executes guards accordingly.
 *
 * It performs the activation checks in different scenarios based on the navigation state:
 * - If the navigation state is a router sync state, it executes the guards and agrees for navigation.
 * - If the navigation state is a guard check state, it executes the guards and returns false if any guard disagrees, otherwise continues with navigation.
 * - If no information was provided in the navigation state, it waits for the guard check promise to resolve and then executes the guards.
 */
@Injectable({ providedIn: 'root' })
export class ActivateGuardsWrapper {
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
    const futureUrl = getUrlFromSnapshot(route)
    console.log('Performing canActivate for', route, guardsNavigationState)

    if (this.guardsNavigationStateController.isRouterSyncState(guardsNavigationState)) {
      // Important to make sure all guarded functionality is executed
      return this.executeActivateGuards(route, state, guards, combineToBoolean).then(() => executeRouterSyncGuard())
    }

    if (this.guardsNavigationStateController.isGuardCheckState(guardsNavigationState)) {
      console.log(
        'Activate check requested, will perform activate guards checks and send false if I dont agree. Else will continue with navigation.'
      )
      return this.executeActivateGuards(route, state, guards, combineToBoolean).then((result) => {
        console.log('Activate guards result:', result)
        if (result === false) {
          console.log('Route is guarded, returning false.')
          this.guardsGatherer.resolveRoute(futureUrl, false)
          return false
        }

        return true
      })
    }

    //Wait until we received info from others
    let checkStartPromise = this.guardsNavigationStateController.getGuardCheckPromise(guardsNavigationState)
    if (!checkStartPromise) {
      console.warn('No guard check promise found in guards navigation state, returning true.')
      checkStartPromise = Promise.resolve(true)
    }
    return checkStartPromise.then((result) => {
      if (result === false) {
        console.log('Route is guarded by someone else, returning false.')
        return false
      }
      console.log('No one guarded the route, running my own guards', route, state)
      return this.executeActivateGuards(route, state, guards, combineToGuardResult)
    })
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

  private mapActivateGuardToFunctionReturningPromise(
    guard: Type<CanActivate> | CanActivateFn
  ): (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Promise<GuardResult> {
    if (this.isCanActivateClassBasedGuard(guard)) {
      // guard for CanActivate is not a guard instance but class definition
      const guardInstance = this.injector.get(guard)
      return (route, state) => resolveToPromise(guardInstance.canActivate(route, state))
    } else if (typeof guard === 'function') {
      return (route, state) => resolveToPromise(guard(route, state))
    }

    console.warn('Guard does not implement canActivate:', guard)
    return () => Promise.resolve(true)
  }

  private isCanActivateClassBasedGuard(guard: Type<CanActivate> | CanActivateFn): guard is Type<CanActivate> {
    return typeof guard === 'function' && guard.prototype && 'canActivate' in guard.prototype
  }
}
