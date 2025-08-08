import { inject, Injectable, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Gatherer } from '@onecx/accelerator'
import { GuardsNavigationStateController } from './guards-navigation-controller.utils'

export type GuardResultRequest = {
  url: string
}

export type GuardResultResponse = boolean

/**
 * GuardsGatherer is used to gather results of CanActivate and CanDeactivate guards.
 * It allows to perform guard checks of CanActivate and CanDeactivate of the application.
 * GuardsGatherer adds information in the navigation state to request guard checks.
 * It is expected that guards wrappers will use this information to perform checks without navigating and reject navigation if checks are not successful. Otherwise, it will proceed with the navigation and navigation will be rejected on GuardsCheckEnd.
 * It uses a Gatherer to manage the requests and responses.
 */
@Injectable({
  providedIn: 'root',
})
export class GuardsGatherer implements OnDestroy {
  private guardsGatherer: Gatherer<GuardResultRequest, GuardResultResponse> | undefined
  private guardsChecks: Map<string, (value: GuardResultResponse) => void> | undefined
  private guardsNavigationStateController = inject(GuardsNavigationStateController)

  constructor(private router: Router) {}

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
    const resolve = this.guardsChecks.get(routeUrl)
    resolve && resolve(response)
    this.guardsChecks.delete(routeUrl)
  }

  /**
   * Activates the GuardsGatherer service.
   * It initializes the Gatherer and sets up the callback to execute guard checks.
   */
  activate(): void {
    console.log('GuardsGatherer activate')
    this.guardsGatherer = new Gatherer('GuardGatherer', 1, (request) => this.executeGuardsCallback(request))
    this.guardsChecks = new Map()
  }

  /**
   * Deactivates the GuardsGatherer service.
   * It destroys the Gatherer and clears the checks.
   */
  deactivate(): void {
    console.log('GuardsGatherer deactivate')
    this.guardsGatherer?.destroy()
  }

  private executeGuardsCallback(request: GuardResultRequest): Promise<GuardResultResponse> {
    console.log('Executing callback for request:', request)
    const routeUrl = request.url

    // Fake navigation to request guard check
    this.router.navigateByUrl(routeUrl, {
      state: this.guardsNavigationStateController.createGuardCheck(),
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

  private throwNotActiveError(): never {
    throw new Error('Guards gatherer is not active')
  }
}
