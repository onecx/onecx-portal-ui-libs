import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const navigationRules: MappingRule[] = [
  // ─── Select Month ─────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.selectMonth.hoverBackground',
    to: 'components.datepicker.selectMonth.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.selectMonth.color',
    to: 'components.datepicker.selectMonth.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.selectMonth.hoverColor',
    to: 'components.datepicker.selectMonth.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.selectMonth.padding',
    to: 'components.datepicker.selectMonth.padding',
  },
  {
    from: 'usages.calendar.selectMonth.border.radius',
    to: 'components.datepicker.selectMonth.borderRadius',
  },
  {
    from: 'usages.calendar.selectMonth.fontWeight',
    to: 'components.datepicker.selectMonth.fontWeight',
  },
  {
    from: 'usages.calendar.selectMonth.fontSize',
    to: 'components.datepicker.selectMonth.fontSize',
  },

  // ─── Select Year ──────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.selectYear.hoverBackground',
    to: 'components.datepicker.selectYear.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.selectYear.color',
    to: 'components.datepicker.selectYear.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.selectYear.hoverColor',
    to: 'components.datepicker.selectYear.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.selectYear.padding',
    to: 'components.datepicker.selectYear.padding',
  },
  {
    from: 'usages.calendar.selectYear.border.radius',
    to: 'components.datepicker.selectYear.borderRadius',
  },
  {
    from: 'usages.calendar.selectYear.fontWeight',
    to: 'components.datepicker.selectYear.fontWeight',
  },
  {
    from: 'usages.calendar.selectYear.fontSize',
    to: 'components.datepicker.selectYear.fontSize',
  },

  // ─── Group ────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.group.border.color',
    to: 'components.datepicker.group.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.group.gap',
    to: 'components.datepicker.group.gap',
  },
];
