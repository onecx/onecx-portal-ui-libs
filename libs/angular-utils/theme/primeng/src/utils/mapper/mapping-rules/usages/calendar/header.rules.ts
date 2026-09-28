import type { MappingRule } from '../../../mapper.types'
import { toColorString } from '../../../mapper.utils'

export const headerRules: MappingRule[] = [
  // ─── Header ───────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.background',
    to: 'components.datepicker.header.background',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.border.color',
    to: 'components.datepicker.header.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.color',
    to: 'components.datepicker.header.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.padding',
    to: 'components.datepicker.header.padding',
  },

  // ─── Title ────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.gap',
    to: 'components.datepicker.title.gap',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.selectMonth.defaultVariant.defaultState.font.weight',
    to: 'components.datepicker.title.fontWeight',
  },
]
