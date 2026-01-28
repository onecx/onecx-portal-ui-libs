import { inject, Injectable, Injector, Type } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  CanDeactivateFn,
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
  logGuardsDebug,
  resolveToPromise,
} from './guards-utils.utils'

/**
 * Wrapper for canDeactivate guards that handles the navigation state and executes guards accordingly.
 *
 * It performs the deactivation checks in different scenarios based on the navigation state
 */
@Injectable({ providedIn: 'root' })
export class DeactivateGuardsWrapper {
  private readonly injector = inject(Injector)
  private readonly guardsGatherer = inject(GuardsGatherer)
  protected router = inject(Router)
  private readonly guardsNavigationStateController = inject(GuardsNavigationStateController)

  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    guards: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>
  ): MaybeAsync<GuardResult> {
    const guardsNavigationState = (this.router.currentNavigation()?.extras.state ?? {}) as GuardsNavigationState
    const futureUrl = nextState.url

    switch (this.guardsNavigationStateController.getMode(guardsNavigationState)) {
      case GUARD_MODE.INITIAL_ROUTER_SYNC:
        return this.executeDeactivateGuards(component, currentRoute, currentState, nextState, guards, combineToBoolean)
      case GUARD_MODE.ROUTER_SYNC:
        return this.executeDeactivateGuards(
          component,
          currentRoute,
          currentState,
          nextState,
          guards,
          combineToBoolean
        ).then(() => executeRouterSyncGuard())
      case GUARD_MODE.GUARD_CHECK:
        return this.executeDeactivateGuards(
          component,
          currentRoute,
          currentState,
          nextState,
          guards,
          combineToBoolean
        ).then((result) => {
          if (result === false) {
            logGuardsDebug('GuardCheck - Route is guarded for deactivation, resolving false.')
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
              `Cannot route to ${futureUrl} because ${currentState.url} deactivation is guarded or ${futureUrl} activation its guarded.`
            )
            return false
          }
          return this.executeDeactivateGuards(
            component,
            currentRoute,
            currentState,
            nextState,
            guards,
            combineToGuardResult
          )
        })
      }
    }
  }

  private executeDeactivateGuards<T extends boolean | GuardResult>(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    guards: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>,
    combineFn: (results: GuardResult[]) => T
  ) {
    if (!currentRoute.routeConfig) {
      logGuardsDebug('No route configuration found for canActivate guard.')
      return Promise.resolve(true as T)
    }

    const canDeactivateFunctions = guards.map((guard) => this.mapDeactivateGuardToFunctionReturningPromise(guard))

    const canDeactivateResults = Promise.all(
      canDeactivateFunctions.map((fn) => {
        try {
          return fn(component, currentRoute, currentState, nextState)
        } catch {
          console.warn('Guard does not implement canDeactivate:', fn)
          return Promise.resolve(true) // Default to true if guard does not implement canDeactivate
        }
      })
    )
    return canDeactivateResults.then((results) => combineFn(results))
  }

  private mapDeactivateGuardToFunctionReturningPromise(
    guard: Type<CanDeactivate<any>> | CanDeactivateFn<any>
  ): (
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) => Promise<GuardResult> {
    if (this.isCanDeactivateClassBasedGuard(guard)) {
      // guard for CanDeactivate is not a guard instance but class definition
      const guardInstance = this.injector.get(guard)
      return (component, currentRoute, currentState, nextState) =>
        resolveToPromise(guardInstance.canDeactivate(component, currentRoute, currentState, nextState))
    }

    return (component, currentRoute, currentState, nextState) =>
      resolveToPromise(guard(component, currentRoute, currentState, nextState))
  }

  private isCanDeactivateClassBasedGuard(
    guard: Type<CanDeactivate<any>> | CanDeactivateFn<any>
  ): guard is Type<CanDeactivate<any>> {
    return typeof guard === 'function' && guard.prototype && 'canDeactivate' in guard.prototype
  }
}
