import { useMemo } from 'react'
import { useLocation, useMatches } from 'react-router'
import type { GuardsNavigationState } from '../model/guard-navigation.model'
import { GuardsGatherer } from '../services/guards-gatherer'
import { wrapGuards, WrappedGuards } from '../utils/wrap-guards.utils'

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
