import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const calendarRules: MappingRule[] = [
  // ─── Day View ─────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.dayView.margin',
    to: 'components.datepicker.dayView.margin',
  },

  // ─── Week Day ─────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.weekDay.padding',
    to: 'components.datepicker.weekDay.padding',
  },
  {
    from: 'usages.calendar.weekDay.fontWeight',
    to: 'components.datepicker.weekDay.fontWeight',
  },
  {
    from: 'usages.calendar.weekDay.color',
    to: 'components.datepicker.weekDay.color',
    transform: toColorString,
  },

  // ─── Date ─────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.date.hoverBackground',
    to: 'components.datepicker.date.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.date.selectedBackground',
    to: 'components.datepicker.date.selectedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.date.rangeSelectedBackground',
    to: 'components.datepicker.date.rangeSelectedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.date.color',
    to: 'components.datepicker.date.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.date.hoverColor',
    to: 'components.datepicker.date.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.date.selectedColor',
    to: 'components.datepicker.date.selectedColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.date.rangeSelectedColor',
    to: 'components.datepicker.date.rangeSelectedColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.date.width',
    to: 'components.datepicker.date.width',
  },
  {
    from: 'usages.calendar.date.height',
    to: 'components.datepicker.date.height',
  },
  {
    from: 'usages.calendar.date.border.radius',
    to: 'components.datepicker.date.borderRadius',
  },
  {
    from: 'usages.calendar.date.padding',
    to: 'components.datepicker.date.padding',
  },
  {
    from: 'usages.calendar.date.focusRing.width',
    to: 'components.datepicker.date.focusRing.width',
  },
  {
    from: 'usages.calendar.date.focusRing.style',
    to: 'components.datepicker.date.focusRing.style',
  },
  {
    from: 'usages.calendar.date.focusRing.color',
    to: 'components.datepicker.date.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.date.focusRing.offset',
    to: 'components.datepicker.date.focusRing.offset',
  },
  {
    from: 'usages.calendar.date.focusRing.shadow',
    to: 'components.datepicker.date.focusRing.shadow',
  },

  // ─── Month View ───────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.monthView.margin',
    to: 'components.datepicker.monthView.margin',
  },

  // ─── Month ────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.month.padding',
    to: 'components.datepicker.month.padding',
  },
  {
    from: 'usages.calendar.month.border.radius',
    to: 'components.datepicker.month.borderRadius',
  },

  // ─── Year View ────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.yearView.margin',
    to: 'components.datepicker.yearView.margin',
  },

  // ─── Year ─────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.year.padding',
    to: 'components.datepicker.year.padding',
  },
  {
    from: 'usages.calendar.year.border.radius',
    to: 'components.datepicker.year.borderRadius',
  },
];
