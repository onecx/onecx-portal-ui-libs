import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const controlsRules: MappingRule[] = [
  // ─── Button Bar ───────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.footerButtonBar.defaultVariant.defaultState.padding',
    to: 'components.datepicker.buttonbar.padding',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.footerButtonBar.defaultVariant.defaultState.border.color',
    to: 'components.datepicker.buttonbar.borderColor',
    transform: toColorString,
  },

  // ─── Time Picker ──────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.timePicker.defaultVariant.defaultState.padding',
    to: 'components.datepicker.timePicker.padding',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.timePicker.defaultVariant.defaultState.border.color',
    to: 'components.datepicker.timePicker.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.timePicker.defaultVariant.defaultState.gap',
    to: 'components.datepicker.timePicker.gap',
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.timePicker.defaultVariant.defaultState.buttonGap',
    to: 'components.datepicker.timePicker.buttonGap',
  },

  // ─── Today ────────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.today.background',
    to: 'components.datepicker.today.background',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState.datePanel.defaultVariant.defaultState.today.color',
    to: 'components.datepicker.today.color',
    transform: toColorString,
  },
];
