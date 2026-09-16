import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

// The footer button bar, time picker and date panel all sit inside the panel's
// variant/state block (each with its own variant/state tree where applicable).
const PANEL = 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState';
const FOOTER_BAR = `${PANEL}.footerButtonBar.defaultVariant.defaultState`;
const TIME_PICKER = `${PANEL}.timePicker.defaultVariant.defaultState`;
const TODAY = `${PANEL}.datePanel.defaultVariant.defaultState.today`;

export const controlsRules: MappingRule[] = [
  // ─── Button Bar ───────────────────────────────────────────────────────────
  {
    from: `${FOOTER_BAR}.padding`,
    to: 'components.datepicker.buttonbar.padding',
  },
  {
    from: `${FOOTER_BAR}.border.color`,
    to: 'components.datepicker.buttonbar.borderColor',
    transform: toColorString,
  },

  // ─── Time Picker ──────────────────────────────────────────────────────────
  {
    from: `${TIME_PICKER}.padding`,
    to: 'components.datepicker.timePicker.padding',
  },
  {
    from: `${TIME_PICKER}.border.color`,
    to: 'components.datepicker.timePicker.borderColor',
    transform: toColorString,
  },
  {
    from: `${TIME_PICKER}.gap`,
    to: 'components.datepicker.timePicker.gap',
  },
  {
    from: `${TIME_PICKER}.buttonGap`,
    to: 'components.datepicker.timePicker.buttonGap',
  },

  // ─── Today ────────────────────────────────────────────────────────────────
  {
    from: `${TODAY}.background`,
    to: 'components.datepicker.today.background',
    transform: toColorString,
  },
  {
    from: `${TODAY}.color`,
    to: 'components.datepicker.today.color',
    transform: toColorString,
  },
];
