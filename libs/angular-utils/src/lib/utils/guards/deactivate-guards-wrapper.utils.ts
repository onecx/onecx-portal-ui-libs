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
import { GuardsGatherer } from '../../services/guards-gatherer.service'
import { GuardsNavigationStateController } from '../../services/guards-navigation-controller.utils'
import { GuardsNavigationState } from '../../model/guard-navigation.model'
import { combineToBoolean, combineToGuardResult, executeRouterSyncGuard, resolveToPromise } from './guards-utils.utils'

/**
 * Wrapper for canDeactivate guards that handles the navigation state and executes guards accordingly.
 * 
 * It performs the deactivation checks in different scenarios based on the navigation state:
 * - If the navigation state is a router sync state, it executes the guards and agrees for navigation.
 * - If the navigation state is a guard check state, it executes the guards and returns false if any guard disagrees, otherwise continues with navigation.
 * - If no information was provided in the navigation state, it waits for the guard check promise to resolve and then executes the guards.
 */
@Injectable({ providedIn: 'root' })
export class DeactivateGuardsWrapper {
  private injector = inject(Injector)
  private guardsGatherer = inject(GuardsGatherer)
  protected router = inject(Router)
  private guardsNavigationStateController = inject(GuardsNavigationStateController)

  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    guards: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>
  ): MaybeAsync<GuardResult> {
    const guardsNavigationState = (this.router.getCurrentNavigation()?.extras.state ?? {}) as GuardsNavigationState
    const futureUrl = nextState.url
    console.log('Performing canDeactivate for', component, currentRoute, currentState, nextState, guardsNavigationState)

    if (this.guardsNavigationStateController.isRouterSyncState(guardsNavigationState)) {
      // Important to make sure all guarded functionality is executed
      return this.executeDeactivateGuards(
        component,
        currentRoute,
        currentState,
        nextState,
        guards,
        combineToBoolean
      ).then(() => executeRouterSyncGuard())
    }

    if (this.guardsNavigationStateController.isGuardCheckState(guardsNavigationState)) {
      console.log(
        'Deactivate check requested, will perform deactivate guards checks and send false if I dont agree. Else will continue with navigation.'
      )

      return this.executeDeactivateGuards(
        component,
        currentRoute,
        currentState,
        nextState,
        guards,
        combineToBoolean
      ).then((result) => {
        console.log('Deactivate guards result:', result)
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
      console.log('No one guarded the route, running my own guards', component, currentRoute, currentState, nextState)
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

  private executeDeactivateGuards<T extends boolean | GuardResult>(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    guards: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>,
    combineFn: (results: GuardResult[]) => T
  ) {
    if (!currentRoute.routeConfig) {
      console.warn('No route configuration found for canActivate guard.')
      return Promise.resolve(true as T)
    }

    const canDeactivateFunctions = guards.map((guard) => this.mapDeactivateGuardToFunctionReturningPromise(guard))

    const canDeactivateResults = Promise.all(
      canDeactivateFunctions.map((fn) => fn(component, currentRoute, currentState, nextState))
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
    } else if (typeof guard === 'function') {
      return (component, currentRoute, currentState, nextState) =>
        resolveToPromise(guard(component, currentRoute, currentState, nextState))
    }

    console.warn('Guard does not implement canDeactivate:', guard)
    return () => Promise.resolve(true)
  }

  private isCanDeactivateClassBasedGuard(
    guard: Type<CanDeactivate<any>> | CanDeactivateFn<any>
  ): guard is Type<CanDeactivate<any>> {
    return typeof guard === 'function' && guard.prototype && 'canDeactivate' in guard.prototype
  }
}
