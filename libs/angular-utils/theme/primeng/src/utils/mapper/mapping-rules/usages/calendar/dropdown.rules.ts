import type { MappingRule } from '../../../mapper.types';
import { toColorString } from '../../../mapper.utils';

export const dropdownRules: MappingRule[] = [
  // ─── Dropdown ─────────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.dropdown.width',
    to: 'components.datepicker.dropdown.width',
  },
  {
    from: 'usages.calendar.dropdown.sm.width',
    to: 'components.datepicker.dropdown.sm.width',
  },
  {
    from: 'usages.calendar.dropdown.lg.width',
    to: 'components.datepicker.dropdown.lg.width',
  },
  {
    from: 'usages.calendar.dropdown.background',
    to: 'components.datepicker.dropdown.background',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.dropdown.hoverBackground',
    to: 'components.datepicker.dropdown.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.dropdown.activeBackground',
    to: 'components.datepicker.dropdown.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.dropdown.color',
    to: 'components.datepicker.dropdown.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.dropdown.hoverColor',
    to: 'components.datepicker.dropdown.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.dropdown.activeColor',
    to: 'components.datepicker.dropdown.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.dropdown.border.color',
    to: 'components.datepicker.dropdown.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.dropdown.hoverBorderColor',
    to: 'components.datepicker.dropdown.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.dropdown.activeBorderColor',
    to: 'components.datepicker.dropdown.activeBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.dropdown.border.radius',
    to: 'components.datepicker.dropdown.borderRadius',
  },
  {
    from: 'usages.calendar.dropdown.focusRing.width',
    to: 'components.datepicker.dropdown.focusRing.width',
  },
  {
    from: 'usages.calendar.dropdown.focusRing.style',
    to: 'components.datepicker.dropdown.focusRing.style',
  },
  {
    from: 'usages.calendar.dropdown.focusRing.color',
    to: 'components.datepicker.dropdown.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.calendar.dropdown.focusRing.offset',
    to: 'components.datepicker.dropdown.focusRing.offset',
  },
  {
    from: 'usages.calendar.dropdown.focusRing.shadow',
    to: 'components.datepicker.dropdown.focusRing.shadow',
  },

  // ─── Input Icon ───────────────────────────────────────────────────────────
  {
    from: 'usages.calendar.inputIcon.color',
    to: 'components.datepicker.inputIcon.color',
    transform: toColorString,
  },
];
