import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import type { GuardsNavigationState } from '../model/guard-navigation.model'
import type { GuardsGatherer } from '../services/guards-gatherer'
import type { WrappedGuards } from '../utils/wrap-guards.utils'
import { createLogger } from '../utils/logger.utils'
import { useWrappedGuards } from './use-wrapped-guards'

const logger = createLogger('useGuardCheck')

export interface UseGuardCheckOptions {
  /** Enable or disable the effect. Defaults to true. */
  enabled?: boolean
  /** Optional state passed to guard wrappers to influence behavior (mode). */
  guardsNavigationState?: GuardsNavigationState
  /** Optional gatherer used to resolve guard checks across apps. */
  guardsGatherer?: GuardsGatherer
  /** Optional callback fired when the guard check completes. */
  onGuardCheck?: (result: boolean) => void
}

/**
 * Run canMatch, canActivateChild, and canActivate guards whenever the location changes.
 * @param options - hook options for guard execution.
 * @returns wrapped guard helpers and last result.
 */
export function useGuardCheck(options: UseGuardCheckOptions = {}) {
  const { enabled = true, guardsNavigationState, guardsGatherer, onGuardCheck } = options
  const wrapped = useWrappedGuards({ guardsNavigationState, guardsGatherer })
  const location = useLocation()
  const [lastResult, setLastResult] = useState<boolean | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    return runGuardChecks(wrapped, setLastResult, onGuardCheck)
  }, [enabled, wrapped, location.key, onGuardCheck])

  return {
    wrapped,
    lastResult,
  }
}

/**
 * Run the canMatch → canActivateChild → canActivate chain and resolve its boolean result.
 * @param wrapped - wrapped guard helpers to execute.
 * @returns the check result, or undefined when a guard rejects (the rejection is logged).
 */
function resolveGuardResult(wrapped: WrappedGuards): Promise<boolean | undefined> {
  return wrapped
    .canMatch()
    .then((canMatchResult) => (canMatchResult ? wrapped.canActivateChild() : false))
    .then((canActivateChildResult) => (canActivateChildResult ? wrapped.canActivate() : false))
    .catch((error: unknown) => {
      logger.error('Guard check failed', error)
      return undefined
    })
}

/**
 * Report the guard result only while the check is still current, so a result superseded by a newer
 * location is dropped. Guard rejections and callback errors are logged instead of surfacing as
 * unhandled rejections.
 * @param wrapped - wrapped guard helpers to execute.
 * @param setLastResult - state setter invoked with the check result while the check is still current.
 * @param onGuardCheck - optional callback invoked with the check result while the check is still current.
 * @returns cleanup that marks the check as superseded.
 */
function runGuardChecks(
  wrapped: WrappedGuards,
  setLastResult: (result: boolean) => void,
  onGuardCheck?: (result: boolean) => void
): () => void {
  let cancelled = false

  void resolveGuardResult(wrapped)
    .then((result) => {
      if (result !== undefined && !cancelled) {
        setLastResult(result)
        onGuardCheck?.(result)
      }
    })
    .catch((error: unknown) => {
      logger.error('onGuardCheck callback failed', error)
    })

  return () => {
    cancelled = true
  }
}
