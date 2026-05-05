import type { NavigateFunction } from 'react-router'
import { Gatherer } from '@onecx/accelerator'
import { GuardsNavigationStateController } from './guards-navigation-controller'
import { logGuardsDebug } from '../utils/guards-utils.utils'

/**
 * Request for performing guard checks.
 * @param url - target route URL for guard evaluation.
 */
export type GuardResultRequest = {
  url: string
}

/** Response for guard checks. */
export type GuardResultResponse = boolean

/** Name used by the accelerator gatherer topic. */
export const GUARDS_GATHERER_NAME = 'GuardGatherer'

/**
 * Gathers guard check results across apps and triggers guard checks via navigation state.
 */
export class GuardsGatherer {
  private guardsGatherer: Gatherer<GuardResultRequest, GuardResultResponse> | undefined
  private guardsChecks: Map<string, (value: GuardResultResponse) => void> | undefined
  private guardCheckCounter = 0

  /**
   * @param navigate - React Router navigate function used to trigger guard checks.
   * @param guardsNavigationStateController - helper to build guard check state.
   */
  constructor(
    private readonly navigate: NavigateFunction,
    private readonly guardsNavigationStateController = new GuardsNavigationStateController()
  ) {}

  /**
   * Destroy underlying gatherer resources.
   */
  destroy(): void {
    this.guardsGatherer?.destroy()
  }

  /**
   * Schedule guard checks for a given URL.
   * @param request - guard check request payload.
   * @returns Promise resolving with gathered guard responses.
   */
  gather(request: GuardResultRequest) {
    if (this.guardsGatherer === undefined) {
      this.throwNotActiveError()
    }

    request.url = this.normalizeUrl(request.url)
    return this.guardsGatherer.gather(request)
  }

  /**
   * Resolve pending guard check for a specific route.
   * @param routeUrl - route URL that completed guard checks.
   * @param response - guard check result.
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
   * Activate gatherer subscriptions and internal tracking.
   */
  activate(): void {
    this.guardsGatherer = new Gatherer(GUARDS_GATHERER_NAME, 1, (request) => this.executeGuardsCallback(request))
    this.guardsChecks = new Map()
  }

  /**
   * Deactivate gatherer and clear pending checks.
   */
  deactivate(): void {
    this.guardsGatherer?.destroy()
    delete this.guardsChecks
  }

  private executeGuardsCallback(request: GuardResultRequest): Promise<GuardResultResponse> {
    logGuardsDebug('Executing callback for request:', request)
    const routeUrl = this.normalizeUrl(request.url)
    const guardCheckKey = this.getNextGuardCheckKey()

    this.navigate(routeUrl, {
      state: this.guardsNavigationStateController.createGuardCheckState(undefined, guardCheckKey),
      replace: true,
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

  private getNextGuardCheckKey(): string {
    this.guardCheckCounter += 1
    return String(this.guardCheckCounter)
  }

  private normalizeUrl(url: string): string {
    let result = url
    result = result.startsWith('/') ? result : `/${result}`
    result = result.endsWith('/') && result.length > 1 ? result.slice(0, -1) : result
    return result
  }

  private throwNotActiveError(): never {
    throw new Error('Guards gatherer is not active')
  }
}
