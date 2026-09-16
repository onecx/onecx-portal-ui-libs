import type { MappingRule } from '../../../mapper.types'
import { toColorString } from '../../../mapper.utils'

// Header tokens live in the panel header's own variant/state block.
const PANEL = 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState'
const HEADER = `${PANEL}.header.defaultVariant.defaultState`

export const headerRules: MappingRule[] = [
  // ─── Header ───────────────────────────────────────────────────────────────
  {
    from: `${HEADER}.background`,
    to: 'components.datepicker.header.background',
    transform: toColorString,
  },
  {
    // The header border reuses the panel's border color (as before the restructure).
    from: `${PANEL}.border.color`,
    to: 'components.datepicker.header.borderColor',
    transform: toColorString,
  },
  {
    from: `${HEADER}.color`,
    to: 'components.datepicker.header.color',
    transform: toColorString,
  },
  {
    from: `${HEADER}.padding`,
    to: 'components.datepicker.header.padding',
  },

  // ─── Title ────────────────────────────────────────────────────────────────
  {
    from: `${HEADER}.yearMonthNav.gap`,
    to: 'components.datepicker.title.gap',
  },
  {
    from: `${HEADER}.yearMonthNav.font.weight`,
    to: 'components.datepicker.title.fontWeight',
  },
]
