import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const baseRules: MappingRule[] = [
  // ─── Root ─────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.transitionDuration',
    to: 'components.datepicker.root.transitionDuration',
  },

  // ─── Panel ────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.background',
    to: 'components.datepicker.panel.background',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.border.color',
    to: 'components.datepicker.panel.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.color',
    to: 'components.datepicker.panel.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.border.radius',
    to: 'components.datepicker.panel.borderRadius',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.border.shadow',
    to: 'components.datepicker.panel.shadow',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.padding',
    to: 'components.datepicker.panel.padding',
  },
];
