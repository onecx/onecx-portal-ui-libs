import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useMatches, useNavigate } from 'react-router'
import type { Location } from 'react-router'
import type { GuardsNavigationState } from '../model/guard-navigation.model'
import { GuardsGatherer } from '../services/guards-gatherer'
import { wrapGuards, WrappedGuards } from '../utils/wrap-guards.utils'

export interface UseGuardsGathererOptions {
  /**
   * Whether to auto-activate the gatherer on mount and deactivate on unmount.
   * Defaults to true.
   */
  activate?: boolean
}

/**
 * Create a GuardsGatherer tied to the current router navigate function.
 * @param options - hook options controlling activation.
 * @returns GuardsGatherer instance.
 */
export function useGuardsGatherer(options: UseGuardsGathererOptions = {}): GuardsGatherer {
  const { activate = true } = options
  const navigate = useNavigate()

  const gatherer = useMemo(() => new GuardsGatherer(navigate), [navigate])

  useEffect(() => {
    if (!activate) {
      return
    }

    gatherer.activate()
    return () => gatherer.deactivate()
  }, [activate, gatherer])

  return gatherer
}

export interface UseWrappedGuardsOptions {
  /** Optional state passed to guard wrappers to influence behavior (mode). */
  guardsNavigationState?: GuardsNavigationState
  /** Optional gatherer used to resolve guard checks across apps. */
  guardsGatherer?: GuardsGatherer
}

/**
 * Build wrapped guard helpers for the current route matches.
 * @param options - hook options for navigation state and gatherer.
 * @returns wrapped guard helpers.
 */
export function useWrappedGuards(options: UseWrappedGuardsOptions = {}): WrappedGuards {
  const { guardsNavigationState, guardsGatherer } = options
  const matches = useMatches()
  const location = useLocation()

  return useMemo(
    () =>
      wrapGuards({
        matches,
        location,
        guardsNavigationState,
        guardsGatherer,
      }),
    [matches, location, guardsNavigationState, guardsGatherer]
  )
}

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
