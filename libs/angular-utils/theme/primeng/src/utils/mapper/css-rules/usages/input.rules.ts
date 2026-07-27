import type { CssRule } from '../../mapper.types'

export const inputCssRules: CssRule[] = [
  {
    selector: '.p-inputtext:not(:disabled):hover',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.defaultVariant.hover.background'
      },
      {
        property: 'color',
        from: 'usages.input.defaultVariant.hover.color'
      },
      {
        property: 'border-color',
        from: 'usages.input.defaultVariant.hover.border.color'
      },
      {
        property: 'box-shadow',
        from: 'usages.input.defaultVariant.hover.shadow'
      },
      {
        property: 'padding-inline',
        from: 'usages.input.defaultVariant.padding.x'
      },
      {
        property: 'padding-block',
        from: 'usages.input.defaultVariant.padding.y'
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):hover::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.defaultVariant.hover.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):focus',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.defaultVariant.focus.background'
      },
      {
        property: 'color',
        from: 'usages.input.defaultVariant.focus.color'
      },
      {
        property: 'border-color',
        from: 'usages.input.defaultVariant.focus.border.color'
      },
      {
        property: 'box-shadow',
        from: 'usages.input.defaultVariant.focus.shadow'
      },
      {
        property: 'padding-inline',
        from: 'usages.input.defaultVariant.padding.x'
      },
      {
        property: 'padding-block',
        from: 'usages.input.defaultVariant.padding.y'
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):focus::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.defaultVariant.focus.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-inputtext:disabled',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.defaultVariant.disabled.background'
      },
      {
        property: 'color',
        from: 'usages.input.defaultVariant.disabled.color'
      },
      {
        property: 'border-color',
        from: 'usages.input.defaultVariant.disabled.border.color'
      },
      {
        property: 'box-shadow',
        from: 'usages.input.defaultVariant.disabled.shadow'
      },
      {
        property: 'padding-inline',
        from: 'usages.input.defaultVariant.padding.x'
      },
      {
        property: 'padding-block',
        from: 'usages.input.defaultVariant.padding.y'
      },
    ],
  },
  {
    selector: '.p-inputtext:disabled::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.defaultVariant.disabled.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-inputtext.p-invalid',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.defaultVariant.invalid.background'
      },
      {
        property: 'color',
        from: 'usages.input.defaultVariant.invalid.color'
      },
      {
        property: 'border-color',
        from: 'usages.input.defaultVariant.invalid.border.color'
      },
      {
        property: 'box-shadow',
        from: 'usages.input.defaultVariant.invalid.shadow'
      },
      {
        property: 'padding-inline',
        from: 'usages.input.defaultVariant.padding.x'
      },
      {
        property: 'padding-block',
        from: 'usages.input.defaultVariant.padding.y'
      },
    ],
  },
  {
    selector: '.p-inputtext.p-invalid::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.defaultVariant.invalid.placeholder.color'
      },
    ],
  },

  {
    selector: '.p-variant-filled .p-inputtext',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.variants.filled.defaultState.background'
      },
      {
        property: 'color',
        from: 'usages.input.variants.filled.defaultState.color'
      },
      {
        property: 'border-color',
        from: 'usages.input.variants.filled.defaultState.border.color'
      },
      {
        property: 'box-shadow',
        from: 'usages.input.variants.filled.defaultState.shadow'
      },
      {
        property: 'padding-inline',
        from: 'usages.input.variants.filled.padding.x'
      },
      {
        property: 'padding-block',
        from: 'usages.input.variants.filled.padding.y'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.variants.filled.defaultState.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):hover',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.variants.filled.hover.background'
      },
      {
        property: 'color',
        from: 'usages.input.variants.filled.hover.color'
      },
      {
        property: 'border-color',
        from: 'usages.input.variants.filled.hover.border.color'
      },
      {
        property: 'box-shadow',
        from: 'usages.input.variants.filled.hover.shadow'
      },
      {
        property: 'padding-inline',
        from: 'usages.input.variants.filled.padding.x'
      },
      {
        property: 'padding-block',
        from: 'usages.input.variants.filled.padding.y'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):hover::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.variants.filled.hover.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):focus',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.variants.filled.focus.background'
      },
      {
        property: 'color',
        from: 'usages.input.variants.filled.focus.color'
      },
      {
        property: 'border-color',
        from: 'usages.input.variants.filled.focus.border.color'
      },
      {
        property: 'box-shadow',
        from: 'usages.input.variants.filled.focus.shadow'
      },
      {
        property: 'padding-inline',
        from: 'usages.input.variants.filled.padding.x'
      },
      {
        property: 'padding-block',
        from: 'usages.input.variants.filled.padding.y'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):focus::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.variants.filled.focus.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:disabled',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.variants.filled.disabled.background'
      },
      {
        property: 'color',
        from: 'usages.input.variants.filled.disabled.color'
      },
      {
        property: 'border-color',
        from: 'usages.input.variants.filled.disabled.border.color'
      },
      {
        property: 'box-shadow',
        from: 'usages.input.variants.filled.disabled.shadow'
      },
      {
        property: 'padding-inline',
        from: 'usages.input.variants.filled.padding.x'
      },
      {
        property: 'padding-block',
        from: 'usages.input.variants.filled.padding.y'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:disabled::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.variants.filled.disabled.placeholder.color'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext.p-invalid',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.variants.filled.invalid.background'
      },
      {
        property: 'color',
        from: 'usages.input.variants.filled.invalid.color'
      },
      {
        property: 'border-color',
        from: 'usages.input.variants.filled.invalid.border.color'
      },
      {
        property: 'box-shadow',
        from: 'usages.input.variants.filled.invalid.shadow'
      },
      {
        property: 'padding-inline',
        from: 'usages.input.variants.filled.padding.x'
      },
      {
        property: 'padding-block',
        from: 'usages.input.variants.filled.padding.y'
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext.p-invalid::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.variants.filled.invalid.placeholder.color'
      },
    ],
  },
]