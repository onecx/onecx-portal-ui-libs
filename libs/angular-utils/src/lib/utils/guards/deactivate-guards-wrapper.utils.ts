import { inject, Injectable, Injector, Type } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  CanDeactivateFn,
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
 * Wrapper for CanDeactivate guards that allows to gather deactivation results
 * and handle special cases like router sync or scattered guards.
 *
 * It performs the deactivation checks in different scenarios based on the navigation state:
 * - If the navigation state indicates a router sync, it immediately agrees for the navigation.
 * - If the navigation state requests a deactivation check, it performs the deactivation guards checks
 *   and resolves the promise with the results while not allowing the navigation to proceed.
 * - If the navigation state requests an activation check, it checks if deactivation is allowed
 *   and returns true to allow activation checks to proceed.
 * - If no special cases are detected, it executes scattered deactivation guards and gathers results.
 */
@Injectable({ providedIn: 'root' })
export class DeactivateGuardsWrapper extends GuardsWrapper {
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
    const currentUrl = currentState.url
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
        this.combineToBoolean
      ).then(() => this.executeRouterSyncGuard())
    }

    if (this.guardsNavigationStateController.isDeactivateCheckState(guardsNavigationState)) {
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
        this.guardsGatherer.resolveRouteDeactivate(currentUrl, result)

        // Add information to navigation state to indicate that deactivate checks were completed
        this.guardsNavigationStateController.setDeactivationChecksCompleted(guardsNavigationState)
        // Important to return false so navigation does not happen
        return false
      })
    }

    if (this.guardsNavigationStateController.isActivateCheckState(guardsNavigationState)) {
      // Special case when deactivate check was not requested by the navigation requester
      // If activation check is processed in CanDeactivate, we should check if deactivation is allowed
      // and if not, we should return false to prevent navigation
      // If deactivation is allowed, we return true to allow activation checks to proceed
      if (!this.guardsNavigationStateController.isDeactivationChecksCompleted(guardsNavigationState)) {
        console.log(
          'Activate check requested while resolving canDeactivate. Will run deactivate guards and reject navigation if cannot deactivate, else will let activate guards run.'
        )

        const myGuardsResult = this.executeDeactivateGuards(
          component,
          currentRoute,
          currentState,
          nextState,
          guards,
          this.combineToBoolean
        )

        return myGuardsResult.then((result) => {
          // Cannot deactivate, reject navigation
          if (result === false) {
            this.guardsGatherer.resolveRouteActivate(futureUrl, false)
            return false
          }
          // Important to return true so activate guards can run
          return true
        })
      }

      // Deactivation checks were done before and we should check activate guards now
      console.log('Activate check requested, returning true for deactivate checks.')

      // Important to return true so we move to activate checks
      return true
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
