import type { CssRule } from '../../mapper.types'
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
  
  // Hover border color
  {
    selector: '.p-togglebutton:not(:disabled):hover',
    declarations: [
      {
        property: 'border-color',
        from: 'usages.togglebutton.hover.border.color',
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
      {
        property: 'border-color',
        from: 'usages.togglebutton.checked.hover.border.color',
      },
    ],
  },

  // Checked focus state
  {
    selector: '.p-togglebutton.p-togglebutton-checked:focus',
    declarations: [
      {
        property: 'background',
        from: 'usages.togglebutton.checked.focus.background',
      },
      {
        property: 'color',
        from: 'usages.togglebutton.checked.focus.color',
      },
      {
        property: 'border-color',
        from: 'usages.togglebutton.checked.focus.border.color',
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
      {
        property: 'border-color',
        from: 'usages.togglebutton.checked.disabled.border.color',
      },
    ],
  },

  // Checked invalid state
  {
    selector: '.p-togglebutton.p-togglebutton-checked.ng-invalid.ng-dirty',
    declarations: [
      {
        property: 'border-color',
        from: 'usages.togglebutton.checked.invalid.border.color',
      },
    ],
  },

  // Focus state (unchecked)
  {
    selector: '.p-togglebutton:focus',
    declarations: [
      {
        property: 'background',
        from: 'usages.togglebutton.focus.background',
      },
      {
        property: 'color',
        from: 'usages.togglebutton.focus.color',
      },
      {
        property: 'border-color',
        from: 'usages.togglebutton.focus.border.color',
      },
    ],
  },

  // Checked icon hover state
  {
    selector: '.p-togglebutton.p-togglebutton-checked:not(:disabled):hover .p-togglebutton-icon',
    declarations: [
      {
        property: 'color',
        from: 'usages.togglebutton.icon.checked.hover.color',
      },
    ],
  },

  // Checked icon focus state
  {
    selector: '.p-togglebutton.p-togglebutton-checked:focus .p-togglebutton-icon',
    declarations: [
      {
        property: 'color',
        from: 'usages.togglebutton.icon.checked.focus.color',
      },
    ],
  },
  // Checked icon disabled state
  {
    selector: '.p-togglebutton.p-togglebutton-checked:disabled .p-togglebutton-icon',
    declarations: [
      {
        property: 'color',
        from: 'usages.togglebutton.icon.checked.disabled.color',
      },
    ],
  },

  // Icon focus state (unchecked)
  {
    selector: '.p-togglebutton:focus .p-togglebutton-icon',
    declarations: [
      {
        property: 'color',
        from: 'usages.togglebutton.icon.focus.color',
      },
    ],
  },
]
