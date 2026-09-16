import type { MappingRule } from '../../../mapper.types'
import { toColorString } from '../../../mapper.utils'

// Selectors live in the panel header block, each with their own variant/state tree.
const PANEL = 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState'
const HEADER = `${PANEL}.header.defaultVariant.defaultState`
const SELECT_MONTH = `${HEADER}.selectMonth.defaultVariant`
const SELECT_YEAR = `${HEADER}.selectYear.defaultVariant`

export const navigationRules: MappingRule[] = [
  // ─── Select Month ─────────────────────────────────────────────────────────
  {
    from: `${SELECT_MONTH}.hover.background`,
    to: 'components.datepicker.selectMonth.hoverBackground',
    transform: toColorString,
  },
  {
    from: `${SELECT_MONTH}.defaultState.color`,
    to: 'components.datepicker.selectMonth.color',
    transform: toColorString,
  },
  {
    from: `${SELECT_MONTH}.hover.color`,
    to: 'components.datepicker.selectMonth.hoverColor',
    transform: toColorString,
  },
  {
    from: `${SELECT_MONTH}.defaultState.padding`,
    to: 'components.datepicker.selectMonth.padding',
  },
  {
    from: `${SELECT_MONTH}.defaultState.border.radius`,
    to: 'components.datepicker.selectMonth.borderRadius',
  },

  // ─── Select Year ──────────────────────────────────────────────────────────
  {
    from: `${SELECT_YEAR}.hover.background`,
    to: 'components.datepicker.selectYear.hoverBackground',
    transform: toColorString,
  },
  {
    from: `${SELECT_YEAR}.defaultState.color`,
    to: 'components.datepicker.selectYear.color',
    transform: toColorString,
  },
  {
    from: `${SELECT_YEAR}.hover.color`,
    to: 'components.datepicker.selectYear.hoverColor',
    transform: toColorString,
  },
  {
    from: `${SELECT_YEAR}.defaultState.padding`,
    to: 'components.datepicker.selectYear.padding',
  },
  {
    from: `${SELECT_YEAR}.defaultState.border.radius`,
    to: 'components.datepicker.selectYear.borderRadius',
  },

  // ─── Group / MultiMonthDivider ────────────────────────────────────────────
  {
    from: `${PANEL}.multiMonthDivider.border.color`,
    to: 'components.datepicker.group.borderColor',
    transform: toColorString,
  },
  {
    from: `${PANEL}.multiMonthDivider.gap`,
    to: 'components.datepicker.group.gap',
  },
]
