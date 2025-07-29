import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Gatherer } from '@onecx/accelerator'

export type CanActivateGuardResultRequest = {
  url: string
}

export type CanActivateGuardResultResponse = boolean

export type CanDeactivateGuardResultRequest = CanActivateGuardResultRequest

export type CanDeactivateGuardResultResponse = boolean

export enum GUARD_CHECK {
  ACTIVATE = 'activateGuardCheckRequest',
  DEACTIVATE = 'deactivateGuardCheckRequest',
}

@Injectable({
  providedIn: 'root',
})
export class GuardsGatherer {
  private activateGuardsGatherer: Gatherer<CanActivateGuardResultRequest, CanActivateGuardResultResponse> =
    new Gatherer('CanActivateGuard', 1, (request) => this.executeActivateCallback(request))
  private deactivateGuardsGatherer: Gatherer<CanDeactivateGuardResultRequest, CanDeactivateGuardResultResponse> =
    new Gatherer('CanDeactivateGuard', 1, (request) => this.executeDeactivateCallback(request))
  private activateGuardsChecks = new Map<string, (value: CanActivateGuardResultResponse) => void>()
  private deactivateGuardsChecks = new Map<string, (value: CanDeactivateGuardResultResponse) => void>()

  constructor(private router: Router) {
    console.log('GuardsGatherer create')
  }

  gatherActivate(request: CanActivateGuardResultRequest) {
    return this.activateGuardsGatherer.gather(request)
  }

  gatherDeactivate(request: CanDeactivateGuardResultRequest) {
    return this.deactivateGuardsGatherer.gather(request)
  }

  resolveRouteActivate(routeUrl: string, response: CanActivateGuardResultResponse) {
    const resolve = this.activateGuardsChecks.get(routeUrl)
    resolve && resolve(response)
  }

  resolveRouteDeactivate(routeUrl: string, response: CanDeactivateGuardResultResponse) {
    const resolve = this.deactivateGuardsChecks.get(routeUrl)
    resolve && resolve(response)
  }

  destroy(): void {
    console.log('GuardWrapper destroy')
    this.activateGuardsGatherer.destroy()
    this.deactivateGuardsGatherer.destroy()
  }

  private executeActivateCallback(request: CanActivateGuardResultRequest): Promise<CanActivateGuardResultResponse> {
    console.log('Executing activate callback for request:', request)
    const routeUrl = request.url

    // Fake navigation to request guard check
    this.router.navigateByUrl(routeUrl, {
      state: { [GUARD_CHECK.ACTIVATE]: true },
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
      state: { [GUARD_CHECK.DEACTIVATE]: true },
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
