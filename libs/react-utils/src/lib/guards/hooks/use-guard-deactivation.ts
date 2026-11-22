import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import type { Location } from 'react-router'
import { createLogger } from '../utils/logger.utils'
import { useWrappedGuards } from './use-wrapped-guards'
import type { UseGuardCheckOptions } from './use-guard-check'

const logger = createLogger('useGuardDeactivation')

/**
 * Run canDeactivate guards for a next location.
 * @param nextLocation - target location of the next navigation.
 * @param options - hook options for guard execution.
 * @returns wrapped guard helpers and last result.
 */
export function useGuardDeactivation(nextLocation: Location, options: UseGuardCheckOptions = {}) {
  const { enabled = true, guardsNavigationState, guardsGatherer, onGuardCheck } = options
  const wrapped = useWrappedGuards({ guardsNavigationState, guardsGatherer })
  const location = useLocation()
  const [lastResult, setLastResult] = useState<boolean | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    return trackDeactivationCheck(wrapped.canDeactivate(nextLocation), (result) => {
      setLastResult(result)
      onGuardCheck?.(result)
    })
  }, [enabled, wrapped, location.key, nextLocation, onGuardCheck])

  return {
    wrapped,
    lastResult,
  }
}

/**
 * Follow a deactivation check, dropping its result once superseded and logging failures.
 * @param check - promise resolving to the deactivation result.
 * @param onResult - callback applied with the result of the current check.
 * @returns cleanup that supersedes the check.
 */
function trackDeactivationCheck(check: Promise<boolean>, onResult: (result: boolean) => void): () => void {
  let cancelled = false

  void check.then(
    (result) => {
      if (!cancelled) {
        onResult(result)
      }
    },
    (error) => {
      logger.error('canDeactivate check failed', error)
    }
  )

  return () => {
    cancelled = true
  }
}
