import type { MappingRule } from '../../../mapper.types'
import { toColorString } from '../../../mapper.utils'

export const headerRules: MappingRule[] = [
  // ─── Header ───────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.header.background',
    to: 'components.datepicker.header.background',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.header.border.color',
    to: 'components.datepicker.header.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.header.color',
    to: 'components.datepicker.header.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.header.padding',
    to: 'components.datepicker.header.padding',
  },

  // ─── Title ────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.header.yearMonthNav.gap',
    to: 'components.datepicker.title.gap',
  },
  {
    from: 'usages.calendar.panel.header.yearMonthNav.fontWeight',
    to: 'components.datepicker.title.fontWeight',
  },
]
