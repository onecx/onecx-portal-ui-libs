import { inject, Injectable, Injector, OnDestroy, Type } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  CanDeactivate,
  CanDeactivateFn,
  GuardResult,
  MaybeAsync,
  RedirectCommand,
  Route,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Gatherer } from '@onecx/accelerator'
import { isObservable, lastValueFrom } from 'rxjs'

type RouteGuards = Map<
  Route,
  {
    activateGuards: Array<Type<CanActivate> | CanActivateFn>
    deactivateGuards: Array<Type<CanDeactivate<any>> | CanDeactivateFn<any>>
  }
>

type CanActivateGuardResultRequest = {
  url: string
}

type CanActivateGuardResultResponse = boolean

type CanDeactivateGuardResultRequest = CanActivateGuardResultRequest

type CanDeactivateGuardResultResponse = boolean

enum GUARD_CHECK {
  ACTIVATE = 'activateGuardCheckRequest',
  DEACTIVATE = 'deactivateGuardCheckRequest',
}

/**
 * Use this class to wrap CanActivate or CanDeactivate guards.
 * It aggregates all guards and handles cross-application route guarding ensuring consistent state of all routers on the page.
 *
 * There are 3 modes of operation:
 * - Navigation owner
 * - Check requested
 * - Router sync
 *
 * Navigation owner mode:
 * Performs checks for application's guards related to the route and requests all other routers to perform the same checks for their applications. Aggregates results and based on them stops or allows for navigation.
 *
 * Check requested mode:
 * Immediately stops navigation and performs checks for application's guards related to the route. Sends response to the request owner.
 *
 * Router sync mode:
 * Immediately accepts navigation since sync operation means that it was agreed by everyone to perform navigation.
 */
@Injectable({ providedIn: 'root' })
export class GuardWrapper implements CanActivate, CanDeactivate<any>, OnDestroy {
  private routeGuards: RouteGuards = new Map()
  private activateGuardsGatherer: Gatherer<CanActivateGuardResultRequest, CanActivateGuardResultResponse> =
    new Gatherer('CanActivateGuard', 1, (request) => this.executeActivateCallback(request))
  private deactivateGuardsGatherer: Gatherer<CanDeactivateGuardResultRequest, CanDeactivateGuardResultResponse> =
    new Gatherer('CanDeactivateGuard', 1, (request) => this.executeDeactivateCallback(request))
  private activateGuardsChecks = new Map<string, (value: CanActivateGuardResultResponse) => void>()
  private deactivateGuardsChecks = new Map<string, (value: CanDeactivateGuardResultResponse) => void>()

  private router = inject(Router)
  private injector = inject(Injector)

  constructor() {
    console.log('GuardWrapper')
  }

  ngOnDestroy(): void {
    this.activateGuardsGatherer.destroy()
    this.deactivateGuardsGatherer.destroy()
  }

  /**
   * Activate guard performing checks for activate guards related to required route. Behavior is dependent on the mode chosen based on the navigation state.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const navigationState = this.router.getCurrentNavigation()?.extras.state ?? {}
    console.log('Performing canActivate for', route, state, navigationState)

    if ('isRouterSync' in navigationState && navigationState['isRouterSync']) {
      return this.preformRouterSyncGuard()
    }

    if (GUARD_CHECK.ACTIVATE in navigationState && navigationState[GUARD_CHECK.ACTIVATE]) {
      console.log(
        'Activate check requested, returning false for activate checks and resolving promise with guards results.'
      )
      const myGuardsResult = this.executeActivateGuards(route, state, this.combineToBoolean)
      return myGuardsResult.then((result) => {
        const routeUrl = this.getUrlFromSnapshot(route)
        const resolve = this.activateGuardsChecks.get(routeUrl)
        resolve && resolve(result)

        // Important to return false so navigation does not happen
        return false
      })
    }

    return this.performScatteredActivateGuard(route, state)
  }

  /**
   * Deactivate guard performing checks for deactivate guards related to required route. Behavior is dependent on the mode chosen based on the navigation state.
   */
  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    const navigationState = this.router.getCurrentNavigation()?.extras.state ?? {}
    console.log('Performing canDeactivate for', component, currentRoute, currentState, nextState, navigationState)

    if ('isRouterSync' in navigationState && navigationState['isRouterSync']) {
      return this.preformRouterSyncGuard()
    }

    if (GUARD_CHECK.ACTIVATE in navigationState && navigationState[GUARD_CHECK.ACTIVATE]) {
      console.log('Activate check requested, returning true for deactivate checks.')

      // Important to return true so we move to activate checks
      return true
    }

    if (GUARD_CHECK.DEACTIVATE in navigationState && navigationState[GUARD_CHECK.DEACTIVATE]) {
      const myGuardsResult = this.executeDeactivateGuards(
        component,
        currentRoute,
        currentState,
        nextState,
        this.combineToBoolean
      )

      return myGuardsResult.then((result) => {
        const routeUrl = this.getUrlFromSnapshot(currentRoute)
        const resolve = this.deactivateGuardsChecks.get(routeUrl)
        resolve && resolve(result)

        // Important to return false so navigation does not happen
        return false
      })
    }

    return this.performScatteredDeactivateGuard(component, currentRoute, currentState, nextState)
  }

  /**
   * Set activate guards for a route.
   * @param route - Route to set activate guards for.
   * @param newGuards - Array of activate guards to be set.
   */
  setActivateGuards(route: Route, guards: Array<Type<CanActivate> | CanActivateFn>): void {
    this.routeGuards.set(route, {
      activateGuards: guards,
      deactivateGuards: this.routeGuards.get(route)?.deactivateGuards || [],
    })
  }

  /**
   * Set deactivate guards for a route.
   * @param route - Route to set deactivate guards for.
   * @param newGuards - Array of deactivate guards to be set.
   */
  setDeactivateGuards(route: Route, guards: Array<Type<CanDeactivate<any>> | CanDeactivateFn<any>>): void {
    this.routeGuards.set(route, {
      activateGuards: this.routeGuards.get(route)?.activateGuards || [],
      deactivateGuards: guards,
    })
  }

  /**
   * Get activate guards for a route.
   * @param route - Route to get activate guards for.
   */
  getActivateGuards(route: Route): Array<Type<CanActivate> | CanActivateFn> {
    return this.routeGuards.get(route)?.activateGuards || []
  }

  /**
   * Get deactivate guards for a route.
   * @param route - Route to get deactivate guards for.
   */
  getDeactivateGuards(route: Route): Array<Type<CanDeactivate<any>> | CanDeactivateFn<any>> {
    return this.routeGuards.get(route)?.deactivateGuards || []
  }

  /**
   * Add activate guards for a route.
   * @param route - Route to add activate guards for.
   * @param newGuards - Array of activate guards to be added.
   */
  addActivateGuards(route: Route, newGuards: Array<Type<CanActivate> | CanActivateFn>): void {
    this.routeGuards.set(route, {
      activateGuards: [...(this.routeGuards.get(route)?.activateGuards || []), ...newGuards],
      deactivateGuards: this.routeGuards.get(route)?.deactivateGuards || [],
    })
  }

  /**
   * Add deactivate guards for a route.
   * @param route - Route to add deactivate guards for.
   * @param newGuards - Array of deactivate guards to be added.
   */
  addDeactivateGuards(route: Route, newGuards: Array<Type<CanDeactivate<any>> | CanDeactivateFn<any>>): void {
    this.routeGuards.set(route, {
      activateGuards: this.routeGuards.get(route)?.activateGuards || [],
      deactivateGuards: [...(this.routeGuards.get(route)?.deactivateGuards || []), ...newGuards],
    })
  }

  private performScatteredActivateGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('Performing scattered activate guard after running my own guards', route, state)
    const myGuardsResult = this.executeActivateGuards(route, state, this.combineToGuardResult)

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
      return this.activateGuardsGatherer
        .gather({ url: this.getUrlFromSnapshot(route) })
        .then((results) => Array.isArray(results) && this.combineToBoolean(results))
    })
  }

  private performScatteredDeactivateGuard(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) {
    const myGuardsResult = this.executeDeactivateGuards(
      component,
      currentRoute,
      currentState,
      nextState,
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
      return this.deactivateGuardsGatherer
        .gather({ url: this.getUrlFromSnapshot(currentRoute) })
        .then((results) => Array.isArray(results) && this.combineToBoolean(results))
    })
  }

  private preformRouterSyncGuard() {
    console.log('Was RouterSync, returning true.')

    // Important to return true because it was already agreed to perform navigation in the application
    return true
  }

  private executeActivateCallback(request: CanActivateGuardResultRequest): Promise<CanActivateGuardResultResponse> {
    console.log('Executing activate callback for request:', request)
    let resolve: (value: CanActivateGuardResultResponse) => void
    const routeUrl = request.url

    // Fake navigation to request guard check
    this.router.navigateByUrl(routeUrl, {
      // replaceUrl: true,
      state: { [GUARD_CHECK.ACTIVATE]: true },
      onSameUrlNavigation: 'reload',
    })
    return new Promise((r) => {
      resolve = r
      this.activateGuardsChecks.set(routeUrl, resolve)
    })
  }

  private executeDeactivateCallback(
    request: CanDeactivateGuardResultRequest
  ): Promise<CanDeactivateGuardResultResponse> {
    console.log('Executing deactivate callback for request:', request)
    let resolve: (value: CanDeactivateGuardResultResponse) => void
    const routeUrl = request.url

    // Fake navigation to request guard check
    this.router.navigateByUrl(routeUrl, {
      // replaceUrl: true,
      state: { [GUARD_CHECK.DEACTIVATE]: true },
      // Force navigation
      onSameUrlNavigation: 'reload',
    })
    return new Promise((r) => {
      resolve = r
      this.deactivateGuardsChecks.set(routeUrl, resolve)
    })
  }

  /**
   * Executes every deactivate guard for the given route config.
   * Returns aggregated result according to combineFn.
   */
  private executeActivateGuards<T extends boolean | GuardResult>(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    combineFn: (results: GuardResult[]) => T
  ): Promise<T> {
    if (!route.routeConfig) {
      console.warn('No route configuration found for canActivate guard.')
      return Promise.resolve(true as T)
    }

    const guards = this.getActivateGuards(route.routeConfig)
    const canActivateFunctions = guards.map((guard) => this.mapActivateGuardToFunctionReturningPromise(guard))

    const canActivateResults = Promise.all(canActivateFunctions.map((fn) => fn(route, state)))
    return canActivateResults.then((results) => combineFn(results))
  }

  /**
   * Executes every deactivate guard for the given route config.
   * Returns aggregated result according to combineFn.
   */
  private executeDeactivateGuards<T extends boolean | GuardResult>(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
    combineFn: (results: GuardResult[]) => T
  ) {
    if (!currentRoute.routeConfig) {
      console.warn('No route configuration found for canActivate guard.')
      return Promise.resolve(true as T)
    }

    const guards = this.getDeactivateGuards(currentRoute.routeConfig)
    const canDeactivateFunctions = guards.map((guard) => this.mapDeactivateGuardToFunctionReturningPromise(guard))

    const canDeactivateResults = Promise.all(
      canDeactivateFunctions.map((fn) => fn(component, currentRoute, currentState, nextState))
    )
    return canDeactivateResults.then((results) => combineFn(results))
  }

  /**
   * Returns false if any guard returned false.
   * Returns UrTree or RedirectCommand if any guard returned this value type (the first value is returned).
   * Else it returns true.
   */
  private combineToGuardResult(results: GuardResult[]): GuardResult {
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
  private combineToBoolean(results: GuardResult[]): boolean {
    if (results.some((result) => result === false)) {
      return false
    }

    const redirectResult = results.find((result) => result instanceof UrlTree || result instanceof RedirectCommand)
    if (redirectResult) {
      return false
    }

    return true
  }

  private getUrlFromSnapshot(route: ActivatedRouteSnapshot): string {
    const segments: string[] = []

    let currentRoute: ActivatedRouteSnapshot | null = route
    while (currentRoute) {
      segments.unshift(...currentRoute.url.map((segment) => segment.path))
      currentRoute = currentRoute.parent
    }

    return segments.join('/')
  }

  private resolveToPromise(maybeAsync: MaybeAsync<GuardResult>): Promise<GuardResult> {
    if (maybeAsync instanceof Promise) {
      return maybeAsync
    } else if (isObservable(maybeAsync)) {
      return lastValueFrom(maybeAsync)
    }

    return Promise.resolve(maybeAsync)
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

  private isCanActivateClassBasedGuard(guard: Type<CanActivate> | CanActivateFn): guard is Type<CanActivate> {
    return typeof guard === 'function' && guard.prototype && 'canActivate' in guard.prototype
  }

  private isCanDeactivateClassBasedGuard(
    guard: Type<CanDeactivate<any>> | CanDeactivateFn<any>
  ): guard is Type<CanDeactivate<any>> {
    return typeof guard === 'function' && guard.prototype && 'canDeactivate' in guard.prototype
  }
}
