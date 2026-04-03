import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import type { GuardsNavigationState } from '../model/guard-navigation.model'
import { GuardsGatherer } from '../services/guards-gatherer'
import { useWrappedGuards } from './use-wrapped-guards'

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
  const lastResultRef = useRef<boolean | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    void wrapped
      .canMatch()
      .then((canMatchResult) => (canMatchResult ? wrapped.canActivateChild() : false))
      .then((canActivateChildResult) => (canActivateChildResult ? wrapped.canActivate() : false))
      .then((result) => {
        lastResultRef.current = result
        onGuardCheck?.(result)
      })
  }, [enabled, wrapped, location.key, onGuardCheck])

  return {
    wrapped,
    lastResult: lastResultRef.current,
  }
}
