import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const navigationRules: MappingRule[] = [
  // ─── Select Month ─────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.headerPanel.selectMonth.hoverBackground',
    to: 'components.datepicker.selectMonth.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.headerPanel.selectMonth.color',
    to: 'components.datepicker.selectMonth.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.headerPanel.selectMonth.hoverColor',
    to: 'components.datepicker.selectMonth.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.headerPanel.selectMonth.padding',
    to: 'components.datepicker.selectMonth.padding',
  },
  {
    from: 'usages.calendar.panel.headerPanel.selectMonth.border.radius',
    to: 'components.datepicker.selectMonth.borderRadius',
  },

  // ─── Select Year ──────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.headerPanel.selectYear.hoverBackground',
    to: 'components.datepicker.selectYear.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.headerPanel.selectYear.color',
    to: 'components.datepicker.selectYear.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.headerPanel.selectYear.hoverColor',
    to: 'components.datepicker.selectYear.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.headerPanel.selectYear.padding',
    to: 'components.datepicker.selectYear.padding',
  },
  {
    from: 'usages.calendar.panel.headerPanel.selectYear.border.radius',
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
