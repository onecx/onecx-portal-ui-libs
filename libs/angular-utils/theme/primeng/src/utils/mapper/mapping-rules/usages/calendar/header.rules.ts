import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const headerRules: MappingRule[] = [
  // ─── Header ───────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.header.background',
    to: 'components.datepicker.header.background',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.header.border.color',
    to: 'components.datepicker.header.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.header.color',
    to: 'components.datepicker.header.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.header.padding',
    to: 'components.datepicker.header.padding',
  },

  // ─── Title ────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.title.gap',
    to: 'components.datepicker.title.gap',
  },
  {
    from: 'usages.calendar.title.fontWeight',
    to: 'components.datepicker.title.fontWeight',
  },
];
