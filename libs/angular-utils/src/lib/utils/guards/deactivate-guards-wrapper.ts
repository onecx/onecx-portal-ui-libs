import { inject, Injectable, Injector, Type } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  CanDeactivateFn,
  GuardResult,
  MaybeAsync,
  RedirectCommand,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { GuardsWrapper } from './guards-wrapper'
import { GUARD_CHECK, GuardsGatherer } from './guards-gatherer'

@Injectable({ providedIn: 'root' })
export class DeactivateGuardsWrapper extends GuardsWrapper {
  private injector = inject(Injector)
  private guardsGatherer = inject(GuardsGatherer)

  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    guards: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>
  ): MaybeAsync<GuardResult> {
    const navigationState = this.router.getCurrentNavigation()?.extras.state ?? {}
    console.log('Performing canDeactivate for', component, currentRoute, currentState, nextState, navigationState)

    if ('isRouterSync' in navigationState && navigationState['isRouterSync']) {
      return this.executeRouterSyncGuard()
    }

    if (GUARD_CHECK.ACTIVATE in navigationState && navigationState[GUARD_CHECK.ACTIVATE]) {
      console.log('Activate check requested, returning true for deactivate checks.')

      // Important to return true so we move to activate checks
      return true
    }

    if (GUARD_CHECK.DEACTIVATE in navigationState && navigationState[GUARD_CHECK.DEACTIVATE]) {
      console.log('Deactivate check requested, will perform deactivate guards checks and resend the response.')
      const myGuardsResult = this.executeDeactivateGuards(
        component,
        currentRoute,
        currentState,
        nextState,
        guards,
        this.combineToBoolean
      )

      return myGuardsResult.then((result) => {
        console.log('Deactivate guards result:', result)
        const routeUrl = currentState.url
        this.guardsGatherer.resolveRouteDeactivate(routeUrl, result)

        // Important to return false so navigation does not happen
        return false
      })
    }

    return this.executeScatteredDeactivateGuard(component, currentRoute, currentState, nextState, guards)
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

  private executeScatteredDeactivateGuard(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    guards: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>
  ) {
    console.log(
      'Performing scattered deactivate guard after running my own guards',
      component,
      currentRoute,
      currentState,
      nextState
    )
    const myGuardsResult = this.executeDeactivateGuards(
      component,
      currentRoute,
      currentState,
      nextState,
      guards,
      this.combineToGuardResult
    )

    return myGuardsResult.then((result) => {
      // For redirect return immediately to perform redirect
      if (myGuardsResult instanceof UrlTree || myGuardsResult instanceof RedirectCommand) {
        console.log('Was UrlTree or Redirect command, returning it')
        return myGuardsResult
      }
      // For false don't ask others since we don't agree
      if (result === false) {
        console.log('Route is guarded.')
        return result
      }

      console.log('Will gather deactivate from others for route', currentRoute)
      return this.guardsGatherer
        .gatherDeactivate({ url: currentState.url })
        .then((results) => Array.isArray(results) && this.combineToBoolean(results))
        .then((result) => {
          console.log('Scattered deactivate guard result:', result)
          return result
        })
    })
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
        this.resolveToPromise(guardInstance.canDeactivate(component, currentRoute, currentState, nextState))
    } else if (typeof guard === 'function') {
      return (component, currentRoute, currentState, nextState) =>
        this.resolveToPromise(guard(component, currentRoute, currentState, nextState))
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
