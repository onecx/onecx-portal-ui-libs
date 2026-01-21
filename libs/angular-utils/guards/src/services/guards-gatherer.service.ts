import { inject, Injectable, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Gatherer } from '@onecx/accelerator'
import { GuardsNavigationStateController } from './guards-navigation-controller.service'
import { logGuardsDebug } from '../utils/guards-utils.utils'

/**
 * Request for performing guard checks.
 * It contains the URL of the route for which the guard checks are requested.
 */
export type GuardResultRequest = {
  url: string
}

/**
 * Response for the guard checks.
 * It indicates whether the guard checks were successful or not.
 */
export type GuardResultResponse = boolean

export const GUARDS_GATHERER_NAME = 'GuardGatherer'

/**
 * GuardsGatherer is used to gather results of navigation guards.
 * It allows to perform guard checks of the application.
 * GuardsGatherer adds information in the navigation state to request guard checks.
 * It is expected that guards wrappers will use this information to perform checks and respond if checks are not successful. Otherwise, it will proceed with the navigation and navigation will be rejected on GuardsCheckEnd and results will be reported.
 * It uses a Gatherer to manage the requests and responses.
 */
@Injectable({
  providedIn: 'root',
})
export class GuardsGatherer implements OnDestroy {
  private guardsGatherer: Gatherer<GuardResultRequest, GuardResultResponse> | undefined
  private guardsChecks: Map<string, (value: GuardResultResponse) => void> | undefined
  private readonly guardsNavigationStateController = inject(GuardsNavigationStateController)
  private readonly router: Router = inject(Router)

  ngOnDestroy(): void {
    this.guardsGatherer?.destroy()
  }

  /**
   * Schedules a request to gather guard results.
   * @param request - the request to gather guard results
   * @returns Promise that resolves with the response of the guard results.
   */
  gather(request: GuardResultRequest) {
    if (this.guardsGatherer === undefined) {
      this.throwNotActiveError()
    }
    request.url = this.normalizeUrl(request.url)
    return this.guardsGatherer.gather(request)
  }

  /**
   * Resolves the guard results for a specific route.
   * @param routeUrl - the URL of the route for which the guard results are resolved
   * @param response - the response of the guard result
   */
  resolveRoute(routeUrl: string, response: GuardResultResponse) {
    if (this.guardsChecks === undefined) {
      this.throwNotActiveError()
    }
    const url = this.normalizeUrl(routeUrl)
    const resolve = this.guardsChecks.get(url)
    if (resolve) {
      resolve(response)
    }
    this.guardsChecks.delete(url)
  }

  /**
   * Activates the GuardsGatherer service.
   * It initializes the Gatherer and sets up the callback to execute guard checks.
   */
  activate(): void {
    this.guardsGatherer = new Gatherer(GUARDS_GATHERER_NAME, 1, (request) => this.executeGuardsCallback(request))
    this.guardsChecks = new Map()
  }

  /**
   * Deactivates the GuardsGatherer service.
   * It destroys the Gatherer and clears the checks.
   */
  deactivate(): void {
    this.guardsGatherer?.destroy()
    delete this.guardsChecks
  }

  private executeGuardsCallback(request: GuardResultRequest): Promise<GuardResultResponse> {
    logGuardsDebug('Executing callback for request:', request)
    const routeUrl = request.url

    // Fake navigation to request guard check
    this.router.navigateByUrl(routeUrl, {
      state: this.guardsNavigationStateController.createGuardCheckState(),
      // Important, force navigation
      // to ensure that we are checking guards
      // even if the route is already active.
      onSameUrlNavigation: 'reload',
    })

    let resolve: (value: GuardResultResponse) => void
    return new Promise<GuardResultResponse>((r) => {
      resolve = r
      if (this.guardsChecks === undefined) {
        this.throwNotActiveError()
      }
      this.guardsChecks.set(routeUrl, resolve)
    })
  }

  private normalizeUrl(url: string): string {
    let result = url
    result = result.startsWith('/') ? result : `/${result}`
    result = result.endsWith('/') ? result.slice(0, -1) : result
    return result
  }

  private throwNotActiveError(): never {
    throw new Error('Guards gatherer is not active')
  }
}
