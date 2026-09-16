import type { MappingRule } from '../../../mapper.types'
import { toColorString } from '../../../mapper.utils'

// Restructured calendar token paths. Panel-level tokens live under the panel's
// variant/state block; date cells under their own variant/state blocks.
const PANEL = 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState'
const DATE_PANEL = `${PANEL}.datePanel.defaultVariant.defaultState`
const DATE_CELL = `${DATE_PANEL}.dayView.dateCell.defaultVariant`

export const calendarRules: MappingRule[] = [
  // ─── Day View ─────────────────────────────────────────────────────────────
  {
    from: `${DATE_PANEL}.dayView.margin`,
    to: 'components.datepicker.dayView.margin',
  },

  // ─── Week Day ─────────────────────────────────────────────────────────────
  {
    from: `${DATE_PANEL}.dayView.weekDayLabel.padding`,
    to: 'components.datepicker.weekDay.padding',
  },
  {
    from: `${DATE_PANEL}.dayView.weekDayLabel.font.weight`,
    to: 'components.datepicker.weekDay.fontWeight',
  },
  {
    from: `${DATE_PANEL}.dayView.weekDayLabel.color`,
    to: 'components.datepicker.weekDay.color',
    transform: toColorString,
  },

  // ─── Date ─────────────────────────────────────────────────────────────────
  {
    from: `${DATE_CELL}.defaultState.color`,
    to: 'components.datepicker.date.color',
    transform: toColorString,
  },
  {
    from: `${DATE_CELL}.hover.background`,
    to: 'components.datepicker.date.hoverBackground',
    transform: toColorString,
  },
  {
    from: `${DATE_CELL}.hover.color`,
    to: 'components.datepicker.date.hoverColor',
    transform: toColorString,
  },
  {
    from: `${DATE_CELL}.selected.rangeSelectedBackground`,
    to: 'components.datepicker.date.rangeSelectedBackground',
    transform: toColorString,
  },
  {
    from: `${DATE_CELL}.defaultState.width`,
    to: 'components.datepicker.date.width',
  },
  {
    from: `${DATE_CELL}.defaultState.height`,
    to: 'components.datepicker.date.height',
  },
  {
    from: `${DATE_CELL}.defaultState.border.radius`,
    to: 'components.datepicker.date.borderRadius',
  },
  {
    from: `${DATE_CELL}.defaultState.padding`,
    to: 'components.datepicker.date.padding',
  },
  {
    from: `${DATE_CELL}.focus.border.width`,
    to: 'components.datepicker.date.focusRing.width',
  },
  {
    from: `${DATE_CELL}.focus.border.style`,
    to: 'components.datepicker.date.focusRing.style',
  },
  {
    from: `${DATE_CELL}.focus.border.color`,
    to: 'components.datepicker.date.focusRing.color',
    transform: toColorString,
  },
  {
    from: `${DATE_CELL}.focus.border.offset`,
    to: 'components.datepicker.date.focusRing.offset',
  },

  // ─── Month View ───────────────────────────────────────────────────────────
  {
    from: `${DATE_PANEL}.monthView.margin`,
    to: 'components.datepicker.monthView.margin',
  },

  // ─── Month ────────────────────────────────────────────────────────────────
  {
    from: `${DATE_PANEL}.monthView.monthCell.defaultVariant.defaultState.padding`,
    to: 'components.datepicker.month.padding',
  },
  {
    from: `${DATE_PANEL}.monthView.monthCell.defaultVariant.defaultState.border.radius`,
    to: 'components.datepicker.month.borderRadius',
  },

  // ─── Year View ────────────────────────────────────────────────────────────
  {
    from: `${DATE_PANEL}.yearView.margin`,
    to: 'components.datepicker.yearView.margin',
  },

  // ─── Year ─────────────────────────────────────────────────────────────────
  {
    from: `${DATE_PANEL}.yearView.yearCell.defaultVariant.defaultState.padding`,
    to: 'components.datepicker.year.padding',
  },
  {
    from: `${DATE_PANEL}.yearView.yearCell.defaultVariant.defaultState.border.radius`,
    to: 'components.datepicker.year.borderRadius',
  },
]
