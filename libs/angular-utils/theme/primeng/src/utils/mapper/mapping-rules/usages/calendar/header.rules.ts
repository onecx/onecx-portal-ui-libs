import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const headerRules: MappingRule[] = [
  // ─── Header ───────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.headerPanel.background',
    to: 'components.datepicker.header.background',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.headerPanel.border.color',
    to: 'components.datepicker.header.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.headerPanel.color',
    to: 'components.datepicker.header.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.headerPanel.padding',
    to: 'components.datepicker.header.padding',
  },

  // ─── Title ────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.headerPanel.yearMonthNav.gap',
    to: 'components.datepicker.title.gap',
  },
  {
    from: 'usages.calendar.panel.headerPanel.yearMonthNav.fontWeight',
    to: 'components.datepicker.title.fontWeight',
  },
];
