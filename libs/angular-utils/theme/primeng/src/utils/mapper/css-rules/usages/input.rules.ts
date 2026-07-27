import type { CssRule } from '../../mapper.types'

export const inputCssRules: CssRule[] = [
  {
    selector: '.p-inputtext:not(:disabled):hover',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.default.hover.background',
      },
      {
        property: 'color',
        from: 'usages.input.default.hover.color',
      },
      {
        property: 'box-shadow',
        from: 'usages.input.default.hover.shadow',
      },
      {
        property: 'padding-inline',
        from: 'usages.input.default.hover.padding.x',
      },
      {
        property: 'padding-block',
        from: 'usages.input.default.hover.padding.y',
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):hover::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.default.hover.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):focus',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.default.focus.background',
      },
      {
        property: 'color',
        from: 'usages.input.default.focus.color',
      },
      {
        property: 'box-shadow',
        from: 'usages.input.default.focus.shadow',
      },
      {
        property: 'padding-inline',
        from: 'usages.input.default.focus.padding.x',
      },
      {
        property: 'padding-block',
        from: 'usages.input.default.focus.padding.y',
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):focus::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.default.focus.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-inputtext:disabled',
    declarations: [
      {
        property: 'border-color',
        from: 'usages.input.default.disabled.border.color',
      },
      {
        property: 'box-shadow',
        from: 'usages.input.default.disabled.shadow',
      },
      {
        property: 'padding-inline',
        from: 'usages.input.default.disabled.padding.x',
      },
      {
        property: 'padding-block',
        from: 'usages.input.default.disabled.padding.y',
      },
    ],
  },
  {
    selector: '.p-inputtext:disabled::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.default.disabled.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-inputtext.p-invalid',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.default.invalid.background',
      },
      {
        property: 'color',
        from: 'usages.input.default.invalid.color',
      },
      {
        property: 'box-shadow',
        from: 'usages.input.default.invalid.shadow',
      },
      {
        property: 'padding-inline',
        from: 'usages.input.default.invalid.padding.x',
      },
      {
        property: 'padding-block',
        from: 'usages.input.default.invalid.padding.y',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.defaultState.color',
      },
      {
        property: 'border-color',
        from: 'usages.input.filled.defaultState.border.color',
      },
      {
        property: 'box-shadow',
        from: 'usages.input.filled.defaultState.shadow',
      },
      {
        property: 'padding-inline',
        from: 'usages.input.filled.defaultState.padding.x',
      },
      {
        property: 'padding-block',
        from: 'usages.input.filled.defaultState.padding.y',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.defaultState.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):hover',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.hover.color',
      },
      {
        property: 'border-color',
        from: 'usages.input.filled.hover.border.color',
      },
      {
        property: 'box-shadow',
        from: 'usages.input.filled.hover.shadow',
      },
      {
        property: 'padding-inline',
        from: 'usages.input.filled.hover.padding.x',
      },
      {
        property: 'padding-block',
        from: 'usages.input.filled.hover.padding.y',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):hover::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.hover.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):focus',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.focus.color',
      },
      {
        property: 'border-color',
        from: 'usages.input.filled.focus.border.color',
      },
      {
        property: 'box-shadow',
        from: 'usages.input.filled.focus.shadow',
      },
      {
        property: 'padding-inline',
        from: 'usages.input.filled.focus.padding.x',
      },
      {
        property: 'padding-block',
        from: 'usages.input.filled.focus.padding.y',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):focus::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.focus.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:disabled',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.filled.disabled.background',
      },
      {
        property: 'color',
        from: 'usages.input.filled.disabled.color',
      },
      {
        property: 'border-color',
        from: 'usages.input.filled.disabled.border.color',
      },
      {
        property: 'box-shadow',
        from: 'usages.input.filled.disabled.shadow',
      },
      {
        property: 'padding-inline',
        from: 'usages.input.filled.disabled.padding.x',
      },
      {
        property: 'padding-block',
        from: 'usages.input.filled.disabled.padding.y',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:disabled::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.disabled.placeholder.color',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext.p-invalid',
    declarations: [
      {
        property: 'background',
        from: 'usages.input.filled.invalid.background',
      },
      {
        property: 'color',
        from: 'usages.input.filled.invalid.color',
      },
      {
        property: 'border-color',
        from: 'usages.input.filled.invalid.border.color',
      },
      {
        property: 'box-shadow',
        from: 'usages.input.filled.invalid.shadow',
      },
      {
        property: 'padding-inline',
        from: 'usages.input.filled.invalid.padding.x',
      },
      {
        property: 'padding-block',
        from: 'usages.input.filled.invalid.padding.y',
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext.p-invalid::placeholder',
    declarations: [
      {
        property: 'color',
        from: 'usages.input.filled.invalid.placeholder.color',
      },
    ],
  },
]
