import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

// The calendar's panel tokens live under `defaultVariant.panel.defaultVariant.defaultState`
// (the restructured variant/state tree). Every panel-level token below sits in that block.
const PANEL = 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState';

export const baseRules: MappingRule[] = [
  // ─── Root ─────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.transitionDuration',
    to: 'components.datepicker.root.transitionDuration',
  },

  // ─── Panel ────────────────────────────────────────────────────────────────
  {
    from: `${PANEL}.background`,
    to: 'components.datepicker.panel.background',
    transform: toColorString,
  },
  {
    from: `${PANEL}.border.color`,
    to: 'components.datepicker.panel.borderColor',
    transform: toColorString,
  },
  {
    from: `${PANEL}.color`,
    to: 'components.datepicker.panel.color',
    transform: toColorString,
  },
  {
    from: `${PANEL}.border.radius`,
    to: 'components.datepicker.panel.borderRadius',
  },
  {
    from: `${PANEL}.border.shadow`,
    to: 'components.datepicker.panel.shadow',
  },
  {
    from: `${PANEL}.padding`,
    to: 'components.datepicker.panel.padding',
  },
];
