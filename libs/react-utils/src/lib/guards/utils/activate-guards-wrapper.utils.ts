import { GuardsGatherer } from '../services/guards-gatherer'
import { GuardsNavigationStateController } from '../services/guards-navigation-controller'
import { GUARD_MODE, GuardsNavigationState } from '../model/guard-navigation.model'
import type { CanActivateGuard, GuardExecutionContext, GuardResult } from './guard-types.utils'
import { combineToBoolean, executeRouterSyncGuard, logGuardsDebug, resolveToPromise } from './guards-utils.utils'
import { createLogger } from './logger.utils'

/**
 * Executes canActivate guard handlers based on navigation state mode.
 */
export class ActivateGuardsWrapper {
  /**
   * @param guardsGatherer - gatherer used to resolve cross-app guard checks.
   * @param guardsNavigationStateController - controller for guard navigation state.
   */
  constructor(
    private readonly guardsGatherer?: GuardsGatherer,
    private readonly guardsNavigationStateController: GuardsNavigationStateController = new GuardsNavigationStateController()
  ) {}

  /**
   * Execute canActivate guards based on current navigation state.
   * @param context - guard execution context.
   * @param guards - guards to execute.
   * @param guardsNavigationState - navigation state flags.
   * @returns guard result.
   */
  async canActivate(
    context: GuardExecutionContext,
    guards: CanActivateGuard[],
    guardsNavigationState: GuardsNavigationState = {}
  ): Promise<GuardResult> {
    const logger = createLogger('ActivateGuardsWrapper')
    if (guards.length === 0) {
      return true
    }

    const mode = this.guardsNavigationStateController.getMode(guardsNavigationState)
    const futureUrl = context.location.pathname

    switch (mode) {
      case GUARD_MODE.INITIAL_ROUTER_SYNC:
        return this.executeActivateGuards(guards, context, combineToBoolean)
      case GUARD_MODE.ROUTER_SYNC:
        await this.executeActivateGuards(guards, context, combineToBoolean)
        return executeRouterSyncGuard()
      case GUARD_MODE.GUARD_CHECK: {
        const result = await this.executeActivateGuards(guards, context, combineToBoolean)
        if (result === false) {
          logGuardsDebug('GuardCheck - Route is guarded for activation, resolving false.')
          this.guardsGatherer?.resolveRoute(futureUrl, false)
        }
        return result
      }
      case GUARD_MODE.NAVIGATION_REQUESTED: {
        let checkStartPromise = this.guardsNavigationStateController.getGuardCheckPromise(guardsNavigationState)
        if (!checkStartPromise) {
          logger.warn('No guard check promise found in guards navigation state, returning true.')
          checkStartPromise = Promise.resolve(true)
        }
        const checkResult = await checkStartPromise
        if (checkResult === false) {
          logger.warn(`Cannot route to ${futureUrl} because activation is guarded.`)
          return false
        }
        return this.executeActivateGuards(guards, context, combineToBoolean)
      }
    }
  }

  private async executeActivateGuards<T extends boolean>(
    guards: CanActivateGuard[],
    context: GuardExecutionContext,
    combineFn: (results: GuardResult[]) => T
  ): Promise<T> {
    const logger = createLogger('ActivateGuardsWrapper')
    const results = await Promise.all(
      guards.map((guard) => {
        try {
          return resolveToPromise(guard(context))
        } catch {
          logger.warn('Guard does not implement canActivate:', guard)
          return Promise.resolve(true)
        }
      })
    )

    return combineFn(results)
  }
}
