export type AxisKind = 'variant' | 'state' | 'severity' | 'child'

export interface AxisGroupMetadata {
  variants: string[]
  states: string[]
  severities: string[]
  defaultVariant: string
  defaultState: string
  defaultSeverity: string
}

export interface LeafAxisMetadata {
  path: string[]
  groups: AxisGroupMetadata[]
}

export const DEFAULT_FALLBACK_ORDER: AxisKind[] = ['state', 'variant', 'severity']
