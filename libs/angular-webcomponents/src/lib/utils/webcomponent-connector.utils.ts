import { Injector } from '@angular/core'
import { EntrypointType } from './webcomponent-bootstrap.utils'
import { CurrentLocationTopicPayload, EventsTopic, TopicEventType } from '@onecx/integration-interface'
import { filter, Observable, Subscription } from 'rxjs'
import { AppStateService, Capability, ShellCapabilityService } from '@onecx/angular-integration-interface'
import {
  combineToBoolean,
  GuardsGatherer,
  GuardsNavigationState,
  GuardsNavigationStateController,
  IS_ROUTER_SYNC,
  wrapGuards,
} from '@onecx/angular-utils'
import { ActivatedRouteSnapshot, GuardsCheckEnd, GuardsCheckStart, Router, RoutesRecognized } from '@angular/router'
import { getLocation } from '@onecx/accelerator'

export class WebcomponentConnnector {
  private connectionSubscriptions: Subscription[] = []
  private capabilityService: ShellCapabilityService
  private eventsTopic: EventsTopic | undefined
  private guardsGatherer: GuardsGatherer
  private guardsNavigationStateController: GuardsNavigationStateController

  constructor(
    private injector: Injector,
    private entrypointType: EntrypointType
  ) {
    this.capabilityService = new ShellCapabilityService()
    const currentLocationCapabilityAvailable = this.capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)
    this.eventsTopic = currentLocationCapabilityAvailable ? undefined : new EventsTopic()
    this.guardsGatherer = this.injector.get(GuardsGatherer)
    this.guardsNavigationStateController = this.injector.get(GuardsNavigationStateController)
  }

  connect() {
    this.guardsGatherer.activate()
    this.connectionSubscriptions.push(...this.connectRouter())
  }

  disconnect() {
    this.connectionSubscriptions.forEach((sub) => sub.unsubscribe())
    const currentLocationCapabilityAvailable = this.capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)

    if (currentLocationCapabilityAvailable && this.eventsTopic) {
      this.eventsTopic.destroy()
    }
    this.guardsGatherer.deactivate()
  }

  private connectRouter(): Subscription[] {
    const router = this.injector.get(Router, null)
    const appStateService = this.injector.get(AppStateService, null)
    if (!router) {
      if (this.entrypointType === 'microfrontend') {
        console.warn('No router to connect found')
      }
      return []
    }

    if (!appStateService) {
      console.warn('No appStateService found')
      return []
    }

    return [...this.connectRouterGuards(router), this.connectLocationChange(router, appStateService)]
  }

  private connectLocationChange(router: Router, appStateService: AppStateService): Subscription {
    const initialUrl = `${location.pathname.substring(getLocation().deploymentPath.length)}${location.search}${location.hash}`
    router.navigateByUrl(initialUrl, {
      replaceUrl: true,
      state: { [IS_ROUTER_SYNC]: true },
    })
    let lastUrl = initialUrl
    let observable: Observable<TopicEventType | CurrentLocationTopicPayload> =
      appStateService.currentLocation$.asObservable()
    if (this.eventsTopic !== undefined) {
      observable = this.eventsTopic.pipe(filter((e) => e.type === 'navigated'))
    }
    return observable.subscribe(() => {
      const routerUrl = `${location.pathname.substring(getLocation().deploymentPath.length)}${location.search}${location.hash}`
      if (routerUrl !== lastUrl) {
        lastUrl = routerUrl
        router.navigateByUrl(routerUrl, {
          replaceUrl: true,
          state: { isRouterSync: true },
        })
      }
    })
  }

  private connectRouterGuards(router: Router): Subscription[] {
    return [
      this.wrapGuardsOnRouteRecognized(router),
      this.gatherGuardsOnGuardsCheckStart(router),
      this.resolveGuardsOnGuardsCheckEnd(router),
    ]
  }

  /**
   * Wraps guards for the given router on RoutesRecognized event.
   * This will ensure that guards are wrapped for the routes recognized by the router.
   * @param router - The router to wrap guards for.
   */
  private wrapGuardsOnRouteRecognized(router: Router): Subscription {
    return router.events
      .pipe(filter((event) => event instanceof RoutesRecognized))
      .subscribe((event: RoutesRecognized) => {
        console.log('RoutesRecognized Event', event)
        const rootSnapshot = event.state.root
        this.wrapGuardsForRoute(rootSnapshot)
      })
  }

  /**
   * Gathers guards on GuardsCheckStart event.
   * This will ensure that guards are gathered when the resolve starts.
   * It checks the GuardsNavigationState to determine the state of the router.
   * @param router - The router to gather guards for.
   * @param guardsNavigationStateController - The controller to manage the GuardsNavigationState.
   */
  private gatherGuardsOnGuardsCheckStart(router: Router): Subscription {
    return router.events
      .pipe(filter((event) => event instanceof GuardsCheckStart))
      .subscribe((event: GuardsCheckStart) => {
        console.log('GuardsCheckStart Event', event)
        const currentNavigation = router.getCurrentNavigation()
        const guardsNavigationState = (router.getCurrentNavigation()?.extras.state ?? {}) as GuardsNavigationState
        console.log('GuardsCheckStart GuardsNavigationState', guardsNavigationState)
        if (
          this.guardsNavigationStateController.isRouterSyncState(guardsNavigationState) ||
          this.guardsNavigationStateController.isGuardCheckState(guardsNavigationState)
        ) {
          console.log('GuardsCheckStart Skipping for router sync and guards check state', guardsNavigationState)
          return
        }

        const guardsPromise = this.guardsGatherer
          .gather({ url: event.urlAfterRedirects })
          .then((results) => Array.isArray(results) && combineToBoolean(results))

        this.guardsNavigationStateController.createGuardCheckPromise(guardsNavigationState, guardsPromise)
        console.log('GuardsCheckStart Adding promise to navigation', guardsNavigationState)
        if (currentNavigation) currentNavigation.extras.state = guardsNavigationState
      })
  }

  private resolveGuardsOnGuardsCheckEnd(router: Router): Subscription {
    return router.events.pipe(filter((event) => event instanceof GuardsCheckEnd)).subscribe((event: GuardsCheckEnd) => {
      console.log('GuardsCheckEnd Event', event)
      const guardsNavigationState = (router.getCurrentNavigation()?.extras.state ?? {}) as GuardsNavigationState
      console.log('GuardsCheckEnd GuardsNavigationState', guardsNavigationState)
      if (this.guardsNavigationStateController.isRouterSyncState(guardsNavigationState)) {
        console.log('GuardsCheckEnd Skipping for router sync state', guardsNavigationState)
        return
      }

      // If event.shuldActivate is false, it means that the navigation was cancelled already and response has been sent
      if (this.guardsNavigationStateController.isGuardCheckState(guardsNavigationState) && event.shouldActivate) {
        console.log('Guard check state detected, sending positive result back and cancelling navigation.')
        this.guardsGatherer.resolveRoute(event.urlAfterRedirects, true)
        router.navigateByUrl(router.url, { skipLocationChange: true, state: { isRouterSync: true } })
        return
      }
    })
  }

  /**
   * Wraps guards for the given route and its children.
   * @param route - The route to wrap guards for.
   */
  private wrapGuardsForRoute(route: ActivatedRouteSnapshot): void {
    if (!route.routeConfig) {
      console.warn('No routeConfig found for route', route)
    }
    route.routeConfig && wrapGuards(route.routeConfig)
    route.children.forEach((child) => this.wrapGuardsForRoute(child))
  }
}
