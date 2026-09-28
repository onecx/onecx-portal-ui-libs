import type { MappingRule } from '../../../mapper.types'
import { toColorString } from '../../../mapper.utils'

export const navigationRules: MappingRule[] = [
  // ─── Select Month ─────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.selectMonth.defaultVariant.hover.background',
    to: 'components.datepicker.selectMonth.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.selectMonth.defaultVariant.defaultState.color',
    to: 'components.datepicker.selectMonth.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.selectMonth.defaultVariant.hover.color',
    to: 'components.datepicker.selectMonth.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.selectMonth.defaultVariant.defaultState.padding',
    to: 'components.datepicker.selectMonth.padding',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.selectMonth.defaultVariant.defaultState.border.radius',
    to: 'components.datepicker.selectMonth.borderRadius',
  },

  // ─── Select Year ──────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.selectYear.defaultVariant.hover.background',
    to: 'components.datepicker.selectYear.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.selectYear.defaultVariant.defaultState.color',
    to: 'components.datepicker.selectYear.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.selectYear.defaultVariant.hover.color',
    to: 'components.datepicker.selectYear.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.selectYear.defaultVariant.defaultState.padding',
    to: 'components.datepicker.selectYear.padding',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.selectYear.defaultVariant.defaultState.border.radius',
    to: 'components.datepicker.selectYear.borderRadius',
  },

  // ─── Group / MultiMonthDivider ────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.multiMonthDivider.border.color',
    to: 'components.datepicker.group.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.multiMonthDivider.gap',
    to: 'components.datepicker.group.gap',
  },
]
