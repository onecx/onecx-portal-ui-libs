import type { CssRule } from '../../mapper.types'

// CSS rules for properties that have no PrimeNG preset equivalent.
// Add a CssRule entry only when the property genuinely cannot be expressed
// via a mapping rule. See dev-docs/theming/theme-v2.adoc § Adding a New CSS Rule.

export const togglebuttonCssRules: CssRule[] = [
  // Font properties
  {
    selector: '.p-togglebutton',
    declarations: [
      {
        property: 'font-family',
        from: 'usages.togglebutton.font.family',
      },
      {
        property: 'font-size',
        from: 'usages.togglebutton.font.size',
      },
      {
        property: 'font-style',
        from: 'usages.togglebutton.font.style',
      },
      {
        property: 'line-height',
        from: 'usages.togglebutton.font.lineHeight',
      },
      {
        property: 'letter-spacing',
        from: 'usages.togglebutton.font.letterSpacing',
      },
    ],
  },

  // Checked hover state 
  {
    selector: '.p-togglebutton.p-togglebutton-checked:not(:disabled):hover',
    declarations: [
      {
        property: 'background',
        from: 'usages.togglebutton.checked.hover.background',
      },
      {
        property: 'color',
        from: 'usages.togglebutton.checked.hover.color',
      },
    ],
  },

  // Checked disabled state 
  {
    selector: '.p-togglebutton.p-togglebutton-checked:disabled',
    declarations: [
      {
        property: 'background',
        from: 'usages.togglebutton.checked.disabled.background',
      },
      {
        property: 'color',
        from: 'usages.togglebutton.checked.disabled.color',
      },
    ],
  },

  // Checked icon hover state
  {
    selector: '.p-togglebutton.p-togglebutton-checked:not(:disabled):hover .p-togglebutton-icon',
    declarations: [
      {
        property: 'color',
        from: 'usages.togglebutton.checked.icon.hover.color',
      },
    ],
  },
]
