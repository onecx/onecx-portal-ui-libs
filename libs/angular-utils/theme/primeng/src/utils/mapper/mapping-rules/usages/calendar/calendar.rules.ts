import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const calendarRules: MappingRule[] = [
  // ─── Day View ─────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.dayView.margin',
    to: 'components.datepicker.dayView.margin',
  },

  // ─── Week Day ─────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.weekDay.padding',
    to: 'components.datepicker.weekDay.padding',
  },
  {
    from: 'usages.calendar.panel.datePanel.weekDay.fontWeight',
    to: 'components.datepicker.weekDay.fontWeight',
  },
  {
    from: 'usages.calendar.panel.datePanel.weekDay.color',
    to: 'components.datepicker.weekDay.color',
    transform: toColorString,
  },

  // ─── Date ─────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.date.hoverBackground',
    to: 'components.datepicker.date.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.datePanel.date.selectedBackground',
    to: 'components.datepicker.date.selectedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.datePanel.date.rangeSelectedBackground',
    to: 'components.datepicker.date.rangeSelectedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.datePanel.date.color',
    to: 'components.datepicker.date.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.datePanel.date.hoverColor',
    to: 'components.datepicker.date.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.datePanel.date.selectedColor',
    to: 'components.datepicker.date.selectedColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.datePanel.date.rangeSelectedColor',
    to: 'components.datepicker.date.rangeSelectedColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.datePanel.date.width',
    to: 'components.datepicker.date.width',
  },
  {
    from: 'usages.calendar.panel.datePanel.date.height',
    to: 'components.datepicker.date.height',
  },
  {
    from: 'usages.calendar.panel.datePanel.date.border.radius',
    to: 'components.datepicker.date.borderRadius',
  },
  {
    from: 'usages.calendar.panel.datePanel.date.padding',
    to: 'components.datepicker.date.padding',
  },
  {
    from: 'usages.calendar.panel.datePanel.date.focusRing.width',
    to: 'components.datepicker.date.focusRing.width',
  },
  {
    from: 'usages.calendar.panel.datePanel.date.focusRing.style',
    to: 'components.datepicker.date.focusRing.style',
  },
  {
    from: 'usages.calendar.panel.datePanel.date.focusRing.color',
    to: 'components.datepicker.date.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.datePanel.date.focusRing.offset',
    to: 'components.datepicker.date.focusRing.offset',
  },
  {
    from: 'usages.calendar.panel.datePanel.date.focusRing.shadow',
    to: 'components.datepicker.date.focusRing.shadow',
  },

  // ─── Month View ───────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.monthView.margin',
    to: 'components.datepicker.monthView.margin',
  },

  // ─── Month ────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.month.padding',
    to: 'components.datepicker.month.padding',
  },
  {
    from: 'usages.calendar.panel.datePanel.month.border.radius',
    to: 'components.datepicker.month.borderRadius',
  },

  // ─── Year View ────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.yearView.margin',
    to: 'components.datepicker.yearView.margin',
  },

  // ─── Year ─────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.datePanel.year.padding',
    to: 'components.datepicker.year.padding',
  },
  {
    from: 'usages.calendar.panel.datePanel.year.border.radius',
    to: 'components.datepicker.year.borderRadius',
  },
];
