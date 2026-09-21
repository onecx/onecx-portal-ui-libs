import type { CssRule } from '../../mapper.types'

export const inputCssRules: CssRule[] = [
  {
    selector: '.p-inputtext:not(:disabled):hover',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.defaultVariant.hover.defaultSeverity.background',
      },
      {
        property: 'color',
        from: 'usages.input.defaultVariant.hover.defaultSeverity.color',
      },
      {
        property: 'border-color',
        from: 'usages.input.defaultVariant.hover.defaultSeverity.border.color',
      },
      {
        property: 'box-shadow',
        from: 'usages.input.defaultVariant.hover.defaultSeverity.border.shadow',
      },
      {
        property: 'padding-inline',
        from: 'usages.input.defaultVariant.defaultState.defaultSeverity.padding.x',
      },
      {
        property: 'padding-block',
        from: 'usages.input.defaultVariant.defaultState.defaultSeverity.padding.y',
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):hover::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.defaultVariant.hover.defaultSeverity.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):focus',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.defaultVariant.focus.defaultSeverity.background',
      },
      {
        property: 'color',
        from: 'usages.input.defaultVariant.focus.defaultSeverity.color',
      },
      {
        property: 'border-color',
        from: 'usages.input.defaultVariant.focus.defaultSeverity.border.color',
      },
      {
        property: 'box-shadow',
        from: 'usages.input.defaultVariant.focus.defaultSeverity.border.shadow',
      },
      {
        property: 'padding-inline',
        from: 'usages.input.defaultVariant.defaultState.defaultSeverity.padding.x',
      },
      {
        property: 'padding-block',
        from: 'usages.input.defaultVariant.defaultState.defaultSeverity.padding.y',
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):focus::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.defaultVariant.focus.defaultSeverity.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-inputtext:disabled',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.defaultVariant.disabled.defaultSeverity.background',
      },
      {
        property: 'color',
        from: 'usages.input.defaultVariant.disabled.defaultSeverity.color',
      },
      {
        property: 'border-color',
        from: 'usages.input.defaultVariant.disabled.defaultSeverity.border.color',
      },
      {
        property: 'box-shadow',
        from: 'usages.input.defaultVariant.disabled.defaultSeverity.border.shadow',
      },
      {
        property: 'padding-inline',
        from: 'usages.input.defaultVariant.defaultState.defaultSeverity.padding.x',
      },
      {
        property: 'padding-block',
        from: 'usages.input.defaultVariant.defaultState.defaultSeverity.padding.y',
      },
    ],
  },
  {
    selector: '.p-inputtext:disabled::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.defaultVariant.disabled.defaultSeverity.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-inputtext.p-invalid',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.defaultVariant.invalid.defaultSeverity.background',
      },
      {
        property: 'color',
        from: 'usages.input.defaultVariant.invalid.defaultSeverity.color',
      },
      {
        property: 'border-color',
        from: 'usages.input.defaultVariant.invalid.defaultSeverity.border.color',
      },
      {
        property: 'box-shadow',
        from: 'usages.input.defaultVariant.invalid.defaultSeverity.border.shadow',
      },
      {
        property: 'padding-inline',
        from: 'usages.input.defaultVariant.defaultState.defaultSeverity.padding.x',
      },
      {
        property: 'padding-block',
        from: 'usages.input.defaultVariant.defaultState.defaultSeverity.padding.y',
      },
    ],
  },
  {
    selector: '.p-inputtext.p-invalid::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.defaultVariant.invalid.defaultSeverity.placeholder.color',
      },
    ],
  },

  {
    selector: '.p-variant-filled .p-inputtext',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.filled.defaultState.defaultSeverity.background',
      },
      {
        property: 'color',
        from: 'usages.input.filled.defaultState.defaultSeverity.color',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.defaultState.defaultSeverity.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):hover',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.filled.hover.defaultSeverity.background',
      },
      {
        property: 'color',
        from: 'usages.input.filled.hover.defaultSeverity.color',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):hover::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.hover.defaultSeverity.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):focus',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.filled.focus.defaultSeverity.background',
      },
      {
        property: 'color',
        from: 'usages.input.filled.focus.defaultSeverity.color',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):focus::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.focus.defaultSeverity.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:disabled',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.filled.disabled.defaultSeverity.background',
      },
      {
        property: 'color',
        from: 'usages.input.filled.disabled.defaultSeverity.color',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:disabled::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.disabled.defaultSeverity.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext.p-invalid',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.filled.invalid.defaultSeverity.background',
      },
      {
        property: 'color',
        from: 'usages.input.filled.invalid.defaultSeverity.color',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext.p-invalid::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.invalid.defaultSeverity.placeholder.color',
      },
    ],
  },
]
