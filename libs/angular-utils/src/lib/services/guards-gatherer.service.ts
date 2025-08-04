import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Gatherer } from '@onecx/accelerator'
import { GuardsNavigationStateController } from './guards-navigation-controller.utils'

export type CanActivateGuardResultRequest = {
  url: string
}

export type CanActivateGuardResultResponse = boolean

export type CanDeactivateGuardResultRequest = CanActivateGuardResultRequest

export type CanDeactivateGuardResultResponse = boolean

/**
 * GuardsGatherer is used to gather results of CanActivate and CanDeactivate guards.
 * It allows to perform guard checks of CanActivate and CanDeactivate of the application.
 * GuardsGatherer adds information in the navigation state to request guard checks.
 * It is expected that guards wrappers will use this information to perform checks without navigating.
 * It uses a Gatherer to manage the requests and responses.
 */
@Injectable({
  providedIn: 'root',
})
export class GuardsGatherer {
  private activateGuardsGatherer: Gatherer<CanActivateGuardResultRequest, CanActivateGuardResultResponse>
  private deactivateGuardsGatherer: Gatherer<CanDeactivateGuardResultRequest, CanDeactivateGuardResultResponse>
  private activateGuardsChecks: Map<string, (value: CanActivateGuardResultResponse) => void>
  private deactivateGuardsChecks: Map<string, (value: CanDeactivateGuardResultResponse) => void>
  private guardsNavigationStateController = inject(GuardsNavigationStateController)

  constructor(private router: Router) {
    console.log('GuardsGatherer create')
    this.activateGuardsGatherer = new Gatherer('CanActivateGuard', 1, (request) =>
      this.executeActivateCallback(request)
    )
    this.deactivateGuardsGatherer = new Gatherer('CanDeactivateGuard', 1, (request) =>
      this.executeDeactivateCallback(request)
    )
    this.activateGuardsChecks = new Map()
    this.deactivateGuardsChecks = new Map()
  }

  /**
   * Schedules a request to gather CanActivate guard results.
   * @param request - the request to gather CanActivate guard results
   * @returns Promise that resolves with the response of the CanActivate guard results.
   */
  gatherActivate(request: CanActivateGuardResultRequest) {
    return this.activateGuardsGatherer.gather(request)
  }

  /**
   * Schedules a request to gather CanDeactivate guard results.
   * @param request - the request to gather CanDeactivate guard results
   * @returns Promise that resolves with the response of the CanDeactivate guard results.
   */
  gatherDeactivate(request: CanDeactivateGuardResultRequest) {
    return this.deactivateGuardsGatherer.gather(request)
  }

  /**
   * Resolves the CanActivate guard results for a specific route.
   * @param routeUrl - the URL of the route for which the CanActivate guard results are resolved
   * @param response - the response of the CanActivate guard result
   */
  resolveRouteActivate(routeUrl: string, response: CanActivateGuardResultResponse) {
    const resolve = this.activateGuardsChecks.get(routeUrl)
    resolve && resolve(response)
    this.activateGuardsChecks.delete(routeUrl)
  }

  /**
   * Resolves the CanDeactivate guard results for a specific route.
   * @param routeUrl - the URL of the route for which the CanDeactivate guard results are resolved
   * @param response - the response of the CanDeactivate guard result
   */
  resolveRouteDeactivate(routeUrl: string, response: CanDeactivateGuardResultResponse) {
    const resolve = this.deactivateGuardsChecks.get(routeUrl)
    resolve && resolve(response)
    this.deactivateGuardsChecks.delete(routeUrl)
  }

  destroy(): void {
    console.log('GuardsGatherer destroy')
    this.activateGuardsGatherer.destroy()
    this.deactivateGuardsGatherer.destroy()
  }

  private executeActivateCallback(request: CanActivateGuardResultRequest): Promise<CanActivateGuardResultResponse> {
    console.log('Executing activate callback for request:', request)
    const routeUrl = request.url

    // Fake navigation to request guard check
    this.router.navigateByUrl(routeUrl, {
      state: this.guardsNavigationStateController.createActivationCheckState(),
      // Important, force navigation
      // to ensure that we are checking guards
      // even if the route is already active.
      onSameUrlNavigation: 'reload',
    })

    let resolve: (value: CanActivateGuardResultResponse) => void
    return new Promise<CanActivateGuardResultResponse>((r) => {
      resolve = r
      this.activateGuardsChecks.set(routeUrl, resolve)
    })
  }

  private executeDeactivateCallback(
    request: CanDeactivateGuardResultRequest
  ): Promise<CanDeactivateGuardResultResponse> {
    console.log('Executing deactivate callback for request:', request)
    const routeUrl = request.url

    // Fake navigation to request guard check
    this.router.navigateByUrl(routeUrl, {
      state: this.guardsNavigationStateController.createDeactivationCheckState(),
      // Important, force navigation
      // to ensure that we are checking guards
      // even if the route is already active.
      onSameUrlNavigation: 'reload',
    })

    let resolve: (value: CanDeactivateGuardResultResponse) => void
    return new Promise<CanDeactivateGuardResultResponse>((r) => {
      resolve = r
      this.deactivateGuardsChecks.set(routeUrl, resolve)
    })
  }
}
