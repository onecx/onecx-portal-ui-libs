import type { CssRule } from '../../mapper.types';

// CSS rules for properties that have no PrimeNG preset equivalent.
// Add a CssRule entry only when the property genuinely cannot be expressed
// via a mapping rule. See dev-docs/theming/theme-v2.adoc § Adding a New CSS Rule.

export const toggleswitchCssRules: CssRule[] = [
  // border.style has no preset-token equivalent; applied as CSS custom prop.
  {
    selector: '.p-toggleswitch .p-toggleswitch-slider',
    declarations: [
      {
        property: 'border-style',
        from: 'usages.toggleswitch.border.style',
      },
    ],
  },

  // PrimeNG only exposes a single `handle.size` preset token (width = height).
  {
    selector: '.p-toggleswitch .p-toggleswitch-handle',
    declarations: [
      {
        property: 'width',
        from: 'usages.toggleswitch.handle.width',
      },
      {
        property: 'height',
        from: 'usages.toggleswitch.handle.height',
      },
    ],
  },
];

