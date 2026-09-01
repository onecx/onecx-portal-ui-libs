import type { MappingRule } from '../../../mapper.types'
import { toColorString } from '../../../mapper.utils'

export const calendarRules: MappingRule[] = [
  // ─── Day View ─────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.dayView.margin',
    to: 'components.datepicker.dayView.margin',
  },

  // ─── Week Day ─────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.weekDayLabel.padding',
    to: 'components.datepicker.weekDay.padding',
  },
  {
    from: 'usages.calendar.panel.datePanel.weekDayLabel.font.weight',
    to: 'components.datepicker.weekDay.fontWeight',
  },
  {
    from: 'usages.calendar.panel.datePanel.weekDayLabel.color',
    to: 'components.datepicker.weekDay.color',
    transform: toColorString,
  },

  // ─── Date ─────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.dateCell.color',
    to: 'components.datepicker.date.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.datePanel.dateCell.hover.background',
    to: 'components.datepicker.date.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.datePanel.dateCell.hover.color',
    to: 'components.datepicker.date.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.datePanel.dateCell.selected.rangeSelectedBackground',
    to: 'components.datepicker.date.rangeSelectedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.datePanel.dateCell.width',
    to: 'components.datepicker.date.width',
  },
  {
    from: 'usages.calendar.panel.datePanel.dateCell.height',
    to: 'components.datepicker.date.height',
  },
  {
    from: 'usages.calendar.panel.datePanel.dateCell.border.radius',
    to: 'components.datepicker.date.borderRadius',
  },
  {
    from: 'usages.calendar.panel.datePanel.dateCell.padding',
    to: 'components.datepicker.date.padding',
  },
  {
    from: 'usages.calendar.panel.datePanel.dateCell.focus.border.width',
    to: 'components.datepicker.date.focusRing.width',
  },
  {
    from: 'usages.calendar.panel.datePanel.dateCell.focus.border.style',
    to: 'components.datepicker.date.focusRing.style',
  },
  {
    from: 'usages.calendar.panel.datePanel.dateCell.focus.border.color',
    to: 'components.datepicker.date.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.datePanel.dateCell.focus.border.offset',
    to: 'components.datepicker.date.focusRing.offset',
  },

  // ─── Month View ───────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.monthView.margin',
    to: 'components.datepicker.monthView.margin',
  },

  // ─── Month ────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.monthCell.padding',
    to: 'components.datepicker.month.padding',
  },
  {
    from: 'usages.calendar.panel.datePanel.monthCell.border.radius',
    to: 'components.datepicker.month.borderRadius',
  },

  // ─── Year View ────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.yearView.margin',
    to: 'components.datepicker.yearView.margin',
  },

  // ─── Year ─────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.yearCell.padding',
    to: 'components.datepicker.year.padding',
  },
  {
    from: 'usages.calendar.panel.datePanel.yearCell.border.radius',
    to: 'components.datepicker.year.borderRadius',
  },
]
