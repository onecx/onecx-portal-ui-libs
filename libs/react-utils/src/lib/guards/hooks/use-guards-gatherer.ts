import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { GuardsGatherer } from '../services/guards-gatherer'

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
