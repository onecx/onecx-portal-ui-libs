import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const controlsRules: MappingRule[] = [
  // ─── Button Bar ───────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.buttonBar.padding',
    to: 'components.datepicker.buttonbar.padding',
  },
  {
    from: 'usages.calendar.buttonBar.border.color',
    to: 'components.datepicker.buttonbar.borderColor',
    transform: toColorString,
  },

  // ─── Time Picker ──────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.timePicker.padding',
    to: 'components.datepicker.timePicker.padding',
  },
  {
    from: 'usages.calendar.timePicker.border.color',
    to: 'components.datepicker.timePicker.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.timePicker.gap',
    to: 'components.datepicker.timePicker.gap',
  },
  {
    from: 'usages.calendar.timePicker.buttonGap',
    to: 'components.datepicker.timePicker.buttonGap',
  },

  // ─── Today ────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.today.background',
    to: 'components.datepicker.today.background',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.today.color',
    to: 'components.datepicker.today.color',
    transform: toColorString,
  },
];
