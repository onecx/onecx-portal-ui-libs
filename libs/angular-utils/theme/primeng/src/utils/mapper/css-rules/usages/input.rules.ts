import type { CssRule } from '../../mapper.types'

export const inputCssRules: CssRule[] = [
  {
    selector: '.p-inputtext:not(:disabled):hover',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.hover.background'
      },
      {
        property: 'color',
        from: 'usages.input.hover.color'
      },
      {
        property: 'border-color',
        from: 'usages.input.hover.border.color'
      },
      {
        property: 'box-shadow',
        from: 'usages.input.hover.border.shadow'
      },
      {
        property: 'padding-inline',
        from: 'usages.input.padding.x'
      },
      {
        property: 'padding-block',
        from: 'usages.input.padding.y'
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):hover::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.hover.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):focus',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.focus.background'
      },
      {
        property: 'color',
        from: 'usages.input.focus.color'
      },
      {
        property: 'border-color',
        from: 'usages.input.focus.border.color'
      },
      {
        property: 'box-shadow',
        from: 'usages.input.focus.border.shadow'
      },
      {
        property: 'padding-inline',
        from: 'usages.input.padding.x'
      },
      {
        property: 'padding-block',
        from: 'usages.input.padding.y'
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):focus::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.focus.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-inputtext:disabled',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.disabled.background'
      },
      {
        property: 'color',
        from: 'usages.input.disabled.color'
      },
      {
        property: 'border-color',
        from: 'usages.input.disabled.border.color'
      },
      {
        property: 'box-shadow',
        from: 'usages.input.disabled.border.shadow'
      },
      {
        property: 'padding-inline',
        from: 'usages.input.padding.x'
      },
      {
        property: 'padding-block',
        from: 'usages.input.padding.y'
      },
    ],
  },
  {
    selector: '.p-inputtext:disabled::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.disabled.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-inputtext.p-invalid',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.invalid.background'
      },
      {
        property: 'color',
        from: 'usages.input.invalid.color'
      },
      {
        property: 'border-color',
        from: 'usages.input.invalid.border.color'
      },
      {
        property: 'box-shadow',
        from: 'usages.input.invalid.border.shadow'
      },
      {
        property: 'padding-inline',
        from: 'usages.input.padding.x'
      },
      {
        property: 'padding-block',
        from: 'usages.input.padding.y'
      },
    ],
  },
  {
    selector: '.p-inputtext.p-invalid::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.invalid.placeholder.color'
      },
    ],
  },

  {
    selector: '.p-variant-filled .p-inputtext',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.filled.defaultState.background'
      },
      {
        property: 'color',
        from: 'usages.input.filled.defaultState.color'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.defaultState.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):hover',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.filled.hover.background'
      },
      {
        property: 'color',
        from: 'usages.input.filled.hover.color'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):hover::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.hover.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):focus',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.filled.focus.background'
      },
      {
        property: 'color',
        from: 'usages.input.filled.focus.color'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):focus::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.focus.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:disabled',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.filled.disabled.background'
      },
      {
        property: 'color',
        from: 'usages.input.filled.disabled.color'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:disabled::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.disabled.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext.p-invalid',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.filled.invalid.background'
      },
      {
        property: 'color',
        from: 'usages.input.filled.invalid.color'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext.p-invalid::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.invalid.placeholder.color'
      },
    ],
  },
]
