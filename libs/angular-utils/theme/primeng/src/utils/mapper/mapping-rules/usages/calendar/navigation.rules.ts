import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const navigationRules: MappingRule[] = [
  // ─── Select Month ─────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.header.selectMonth.hover.background',
    to: 'components.datepicker.selectMonth.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.header.selectMonth.color',
    to: 'components.datepicker.selectMonth.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.header.selectMonth.hover.color',
    to: 'components.datepicker.selectMonth.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.header.selectMonth.padding',
    to: 'components.datepicker.selectMonth.padding',
  },
  {
    from: 'usages.calendar.panel.header.selectMonth.border.radius',
    to: 'components.datepicker.selectMonth.borderRadius',
  },

  // ─── Select Year ──────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.header.selectYear.hover.background',
    to: 'components.datepicker.selectYear.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.header.selectYear.color',
    to: 'components.datepicker.selectYear.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.header.selectYear.hover.color',
    to: 'components.datepicker.selectYear.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.header.selectYear.padding',
    to: 'components.datepicker.selectYear.padding',
  },
  {
    from: 'usages.calendar.panel.header.selectYear.border.radius',
    to: 'components.datepicker.selectYear.borderRadius',
  },

  // ─── Group / MultiMonthDivider ────────────────────────────────────────────
  {
    from: 'usages.calendar.multiMonthDivider.border.color',
    to: 'components.datepicker.group.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.multiMonthDivider.gap',
    to: 'components.datepicker.group.gap',
  },
];
