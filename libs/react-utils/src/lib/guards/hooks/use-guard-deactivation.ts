import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import type { Location } from 'react-router'
import type { GuardsNavigationState } from '../model/guard-navigation.model'
import { GuardsGatherer } from '../services/guards-gatherer'
import { useWrappedGuards } from './use-wrapped-guards'
import type { UseGuardCheckOptions } from './use-guard-check'

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
  const lastResultRef = useRef<boolean | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    void wrapped.canDeactivate(nextLocation).then((result) => {
      lastResultRef.current = result
      onGuardCheck?.(result)
    })
  }, [enabled, wrapped, location.key, nextLocation, onGuardCheck])

  return {
    wrapped,
    lastResult: lastResultRef.current,
  }
}
