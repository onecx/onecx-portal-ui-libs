import type { MappingRule } from '../../../mapper.types'
import { toColorString } from '../../../mapper.utils'

export const calendarRules: MappingRule[] = [
  // ─── Day View ─────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.margin',
    to: 'components.datepicker.dayView.margin',
  },

  // ─── Week Day ─────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.weekDayLabel.padding',
    to: 'components.datepicker.weekDay.padding',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.weekDayLabel.font.weight',
    to: 'components.datepicker.weekDay.fontWeight',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.weekDayLabel.color',
    to: 'components.datepicker.weekDay.color',
    transform: toColorString,
  },

  // ─── Date ─────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.dateCell.defaultVariant.defaultState.color',
    to: 'components.datepicker.date.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.dateCell.defaultVariant.hover.background',
    to: 'components.datepicker.date.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.dateCell.defaultVariant.hover.color',
    to: 'components.datepicker.date.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.dateCell.defaultVariant.selected.rangeSelectedBackground',
    to: 'components.datepicker.date.rangeSelectedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.dateCell.defaultVariant.defaultState.width',
    to: 'components.datepicker.date.width',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.dateCell.defaultVariant.defaultState.height',
    to: 'components.datepicker.date.height',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.dateCell.defaultVariant.defaultState.border.radius',
    to: 'components.datepicker.date.borderRadius',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.dateCell.defaultVariant.defaultState.padding',
    to: 'components.datepicker.date.padding',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.dateCell.defaultVariant.focus.border.width',
    to: 'components.datepicker.date.focusRing.width',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.dateCell.defaultVariant.focus.border.style',
    to: 'components.datepicker.date.focusRing.style',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.dateCell.defaultVariant.focus.border.color',
    to: 'components.datepicker.date.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.dayView.dateCell.defaultVariant.focus.border.offset',
    to: 'components.datepicker.date.focusRing.offset',
  },

  // ─── Month View ───────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.monthView.margin',
    to: 'components.datepicker.monthView.margin',
  },

  // ─── Month ────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.monthView.monthCell.defaultVariant.defaultState.padding',
    to: 'components.datepicker.month.padding',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.monthView.monthCell.defaultVariant.defaultState.border.radius',
    to: 'components.datepicker.month.borderRadius',
  },

  // ─── Year View ────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.yearView.margin',
    to: 'components.datepicker.yearView.margin',
  },

  // ─── Year ─────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.yearView.yearCell.defaultVariant.defaultState.padding',
    to: 'components.datepicker.year.padding',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.yearView.yearCell.defaultVariant.defaultState.border.radius',
    to: 'components.datepicker.year.borderRadius',
  },
]
