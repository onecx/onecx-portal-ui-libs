import type { CssRule } from '../../mapper.types';

// CSS rules for properties that have no PrimeNG preset equivalent.
// Add a CssRule entry only when the property genuinely cannot be expressed
// via a mapping rule. See dev-docs/theming/theme-v2/theme-v2.adoc § Adding a New CSS Rule.
//
// Ripple's `background` IS a preset token (mapped in mapping-rules/usages/
// ripple.rules.ts to `components.ripple...root.background`). Only `opacity` is
// unmappable: PrimeNG's `.p-ink` declares no base opacity (it defaults to 1) and
// the `@keyframes ripple` animation fades it to 0, so a themed base opacity must
// be applied straight on the element. The scale factor is PrimeNG-internal to the
// keyframe and intentionally not themable.
export const rippleCssRules: CssRule[] = [
  {
    selector: '.p-ink',
    declarations: [
      {
        property: 'opacity',
        from: 'usages.ripple.ink.opacity',
      },
    ],
  },
];
