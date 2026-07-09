import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const baseRules: MappingRule[] = [
  // ─── Root ─────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.root.transitionDuration',
    to: 'components.datepicker.root.transitionDuration',
  },

  // ─── Panel ────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.panel.background',
    to: 'components.datepicker.panel.background',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.border.color',
    to: 'components.datepicker.panel.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.color',
    to: 'components.datepicker.panel.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.panel.border.radius',
    to: 'components.datepicker.panel.borderRadius',
  },
  {
    from: 'usages.calendar.panel.shadow',
    to: 'components.datepicker.panel.shadow',
  },
  {
    from: 'usages.calendar.panel.padding',
    to: 'components.datepicker.panel.padding',
  },
];
