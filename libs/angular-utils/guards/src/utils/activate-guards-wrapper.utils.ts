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
import { GuardsGatherer } from '../services/guards-gatherer.service'
import { GuardsNavigationStateController } from '../services/guards-navigation-controller.service'
import { GUARD_MODE, GuardsNavigationState } from '../model/guard-navigation.model'
import {
  combineToBoolean,
  combineToGuardResult,
  executeRouterSyncGuard,
  getUrlFromSnapshot,
  logGuardsDebug,
  resolveToPromise,
} from './guards-utils.utils'

/**
 * Wrapper for canActivate guards that handles the navigation state and executes guards accordingly.
 *
 * It performs the activation checks in different scenarios based on the navigation state.
 */
@Injectable({ providedIn: 'root' })
export class ActivateGuardsWrapper {
  private readonly injector = inject(Injector)
  private readonly guardsGatherer = inject(GuardsGatherer)
  protected router = inject(Router)
  private readonly guardsNavigationStateController = inject(GuardsNavigationStateController)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>
  ): MaybeAsync<GuardResult> {
    const guardsNavigationState = this.router.getCurrentNavigation()?.extras.state ?? ({} as GuardsNavigationState)
    const futureUrl = getUrlFromSnapshot(route)

    switch (this.guardsNavigationStateController.getMode(guardsNavigationState)) {
      // We need to let guards run if this is initial router sync
      // If navigation cannot be performed, a new event for window.history will be emitted with navigationId === -1
      // This will be handled by the Shell
      // Additionally, during GuardsCheckEnd, the results will be reported so Shell can decide what to do
      case GUARD_MODE.INITIAL_ROUTER_SYNC:
        return this.executeActivateGuards(route, state, guards, combineToBoolean)
      case GUARD_MODE.ROUTER_SYNC:
        return this.executeActivateGuards(route, state, guards, combineToBoolean).then(() => executeRouterSyncGuard())
      case GUARD_MODE.GUARD_CHECK:
        return this.executeActivateGuards(route, state, guards, combineToBoolean).then((result) => {
          if (result === false) {
            logGuardsDebug('GuardCheck - Route is guarded for activation, resolving false.')
            this.guardsGatherer.resolveRoute(futureUrl, false)
          }

          return result
        })
      case GUARD_MODE.NAVIGATION_REQUESTED: {
        //Wait until we received info from others
        let checkStartPromise = this.guardsNavigationStateController.getGuardCheckPromise(guardsNavigationState)
        if (!checkStartPromise) {
          console.warn('No guard check promise found in guards navigation state, returning true.')
          checkStartPromise = Promise.resolve(true)
        }
        return checkStartPromise.then((result) => {
          if (result === false) {
            console.warn(
              `Cannot route to ${futureUrl} because ${state.url} deactivation is guarded or ${futureUrl} activation its guarded.`
            )
            return false
          }
          return this.executeActivateGuards(route, state, guards, combineToGuardResult)
        })
      }
    }
  }

  private executeActivateGuards<T extends boolean | GuardResult>(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    guards: Array<CanActivateFn | Type<CanActivate>>,
    combineFn: (results: GuardResult[]) => T
  ): Promise<T> {
    if (!route.routeConfig) {
      console.warn('No route configuration found for canActivate guard.')
      logGuardsDebug('No route configuration found for canActivate guard.')
      return Promise.resolve(true as T)
    }

    const canActivateFunctions = guards.map((guard) => this.mapActivateGuardToFunctionReturningPromise(guard))

    const canActivateResults = Promise.all(
      canActivateFunctions.map((fn) => {
        try {
          return fn(route, state)
        } catch {
          console.warn('Guard does not implement canActivate:', fn)
          return Promise.resolve(true) // Default to true if guard does not implement canActivate
        }
      })
    )
    return canActivateResults.then((results) => combineFn(results))
  }
  private mapActivateGuardToFunctionReturningPromise(
    guard: Type<CanActivate> | CanActivateFn
  ): (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Promise<GuardResult> {
    if (this.isCanActivateClassBasedGuard(guard)) {
      // guard for CanActivate is not a guard instance but class definition
      const guardInstance = this.injector.get(guard)
      return (route, state) => resolveToPromise(guardInstance.canActivate(route, state))
    }

    return (route, state) => resolveToPromise(guard(route, state))
  }

  private isCanActivateClassBasedGuard(guard: Type<CanActivate> | CanActivateFn): guard is Type<CanActivate> {
    return typeof guard === 'function' && guard.prototype && 'canActivate' in guard.prototype
  }
}
