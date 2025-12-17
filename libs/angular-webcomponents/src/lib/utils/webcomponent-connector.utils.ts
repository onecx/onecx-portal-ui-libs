import { Injector } from '@angular/core'
import { EntrypointType } from './webcomponent-bootstrap.utils'
import { CurrentLocationTopicPayload, EventsTopic, TopicEventType } from '@onecx/integration-interface'
import { filter, Observable, Subscription } from 'rxjs'
import { AppStateService, Capability, ShellCapabilityService } from '@onecx/angular-integration-interface'
import {
  combineToBoolean,
  GUARD_MODE,
  GuardsGatherer,
  GuardsNavigationState,
  GuardsNavigationStateController,
  IS_INITIAL_ROUTER_SYNC,
  IS_ROUTER_SYNC,
  logGuardsDebug,
  wrapGuards,
} from '@onecx/angular-utils/guards'
import { ActivatedRouteSnapshot, GuardsCheckEnd, GuardsCheckStart, Router, RoutesRecognized } from '@angular/router'
import { getLocation } from '@onecx/accelerator'

/**
 * WebcomponentConnector is a utility class that connects Angular web components.
 * It manages the router connection with other web components and handles the navigation state.
 */
export class WebcomponentConnector {
  private readonly connectionSubscriptions: Subscription[] = []
  private capabilityService: ShellCapabilityService //NOSONAR
  private _eventsTopic$: EventsTopic | undefined
  get eventsTopic() {
    this._eventsTopic$ ??= new EventsTopic()
    return this._eventsTopic$
  }
  private readonly guardsGatherer: GuardsGatherer
  private readonly guardsNavigationStateController: GuardsNavigationStateController

  constructor(
    private readonly injector: Injector,
    private readonly entrypointType: EntrypointType
  ) {
    this.capabilityService = new ShellCapabilityService()
    this.guardsGatherer = this.injector.get(GuardsGatherer)
    this.guardsNavigationStateController = this.injector.get(GuardsNavigationStateController)
  }

  connect() {
    this.guardsGatherer.activate()
    this.connectionSubscriptions.push(...this.connectRouter())
  }

  disconnect() {
    for (const sub of this.connectionSubscriptions) {
      sub.unsubscribe()
    }
    this._eventsTopic$?.destroy()
    this.guardsGatherer.deactivate()
  }

  /**
   * Connects the router of the web component.
   * It sets up the necessary subscriptions to handle navigation and guard checks.
   * @returns Array of subscriptions for the router connection
   */
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

  /**
   * Connects the location change of the web component's router.
   * It sets up the initial URL and subscribes to location changes to update the router accordingly.
   * @param router - The router to connect location change for
   * @param appStateService - The app state service to use for current location topic
   * @returns Subscription for the location change connection
   */
  private connectLocationChange(router: Router, appStateService: AppStateService): Subscription {
    const initialUrl = `${location.pathname.substring(getLocation().deploymentPath.length)}${location.search}${location.hash}`
    router.navigateByUrl(initialUrl, {
      replaceUrl: true,
      state: { [IS_ROUTER_SYNC]: true, [IS_INITIAL_ROUTER_SYNC]: true },
    })
    let lastUrl = initialUrl
    let observable: Observable<TopicEventType | CurrentLocationTopicPayload> =
      appStateService.currentLocation$.asObservable()
    const currentLocationCapabilityAvailable = this.capabilityService.hasCapability(Capability.CURRENT_LOCATION_TOPIC)
    if (!currentLocationCapabilityAvailable) {
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

  /**
   * Connects the router guards for the web component's router.
   * It sets up the necessary subscriptions to handle guard checks and navigation states.
   * @param router - The router to connect guards for
   * @returns Array of subscriptions for the router guards connection
   */
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
        const rootSnapshot = event.state.root
        this.wrapGuardsForRoute(rootSnapshot)
      })
  }

  /**
   * Gathers guards on GuardsCheckStart event.
   * This will ensure that guards are gathered when the resolve starts.
   * It checks the GuardsNavigationState to determine the state of the router.
   * @param router - The router to gather guards for.
   */
  private gatherGuardsOnGuardsCheckStart(router: Router): Subscription {
    return router.events
      .pipe(filter((event) => event instanceof GuardsCheckStart))
      .subscribe((event: GuardsCheckStart) => {
        const currentNavigation = router.getCurrentNavigation()
        if (!currentNavigation) {
          logGuardsDebug('No current navigation found, skipping guards gathering.')
          return
        }

        const guardsNavigationState = (currentNavigation.extras.state ?? {}) as GuardsNavigationState
        const guardMode = this.guardsNavigationStateController.getMode(guardsNavigationState)

        switch (guardMode) {
          case GUARD_MODE.NAVIGATION_REQUESTED: {
            const guardsPromise = this.guardsGatherer
              .gather({ url: event.urlAfterRedirects })
              .then((results) => Array.isArray(results) && combineToBoolean(results))

            this.guardsNavigationStateController.createNavigationRequestedState(guardsPromise, guardsNavigationState)
            currentNavigation.extras.state = guardsNavigationState
            return
          }
          case GUARD_MODE.INITIAL_ROUTER_SYNC:
          case GUARD_MODE.GUARD_CHECK:
          case GUARD_MODE.ROUTER_SYNC:
            return
        }
      })
  }

  private resolveGuardsOnGuardsCheckEnd(router: Router): Subscription {
    return router.events.pipe(filter((event) => event instanceof GuardsCheckEnd)).subscribe((event: GuardsCheckEnd) => {
      const guardsNavigationState = (router.getCurrentNavigation()?.extras.state ?? {}) as GuardsNavigationState
      const mode = this.guardsNavigationStateController.getMode(guardsNavigationState)

      switch (mode) {
        case GUARD_MODE.INITIAL_ROUTER_SYNC:
          if (!event.shouldActivate) {
            console.warn(
              'Initial router sync failed, reverting navigation. This is expected when the app was loaded and the initial navigation was made to a guarded route.'
            )
            this.eventsTopic.publish({
              type: 'revertNavigation',
            })
          }
          return
        case GUARD_MODE.GUARD_CHECK:
          // If event.shouldActivate is false, it means that the navigation was cancelled already and response has been sent
          if (event.shouldActivate) {
            logGuardsDebug('Guard check state detected, sending positive result back and cancelling navigation.')
            this.guardsGatherer.resolveRoute(event.urlAfterRedirects, true)
            router.navigateByUrl(router.url, { skipLocationChange: true, state: { [IS_ROUTER_SYNC]: true } })
          }
          return
        case GUARD_MODE.ROUTER_SYNC:
        case GUARD_MODE.NAVIGATION_REQUESTED:
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
      logGuardsDebug('No routeConfig found for route', route)
    }
    route.routeConfig && wrapGuards(route.routeConfig)
    for (const child of route.children) {
      this.wrapGuardsForRoute(child)
    }
  }
}
