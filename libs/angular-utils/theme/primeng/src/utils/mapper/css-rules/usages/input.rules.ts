import type { CssRule } from '../../mapper.types'

// Restructured input token paths:
// usages.input.{defaultVariant|filled}.{state}.defaultSeverity.{tokens}
const INPUT = 'usages.input'
const D = `${INPUT}.defaultVariant.defaultState.defaultSeverity`
const HOVER = `${INPUT}.defaultVariant.hover.defaultSeverity`
const FOCUS = `${INPUT}.defaultVariant.focus.defaultSeverity`
const DISABLED = `${INPUT}.defaultVariant.disabled.defaultSeverity`
const INVALID = `${INPUT}.defaultVariant.invalid.defaultSeverity`
const FILLED = `${INPUT}.filled.defaultState.defaultSeverity`
const FILLED_HOVER = `${INPUT}.filled.hover.defaultSeverity`
const FILLED_FOCUS = `${INPUT}.filled.focus.defaultSeverity`

export const inputCssRules: CssRule[] = [
  {
    selector: '.p-inputtext:not(:disabled):hover',
    declarations: [
      {
        property: 'background',
        from: `${HOVER}.background`
      },
      {
        property: 'color',
        from: `${HOVER}.color`
      },
      {
        property: 'border-color',
        from: `${HOVER}.border.color`
      },
      {
        property: 'box-shadow',
        from: `${HOVER}.border.shadow`
      },
      {
        property: 'padding-inline',
        from: `${D}.padding.x`
      },
      {
        property: 'padding-block',
        from: `${D}.padding.y`
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):hover::placeholder',
    declarations: [
      {
        property: 'color',
        from: `${HOVER}.placeholder.color`
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):focus',
    declarations: [
      {
        property: 'background',
        from: `${FOCUS}.background`
      },
      {
        property: 'color',
        from: `${FOCUS}.color`
      },
      {
        property: 'border-color',
        from: `${FOCUS}.border.color`
      },
      {
        property: 'box-shadow',
        from: `${FOCUS}.border.shadow`
      },
      {
        property: 'padding-inline',
        from: `${D}.padding.x`
      },
      {
        property: 'padding-block',
        from: `${D}.padding.y`
      },
    ],
  },
  {
    selector: '.p-inputtext:not(:disabled):focus::placeholder',
    declarations: [
      {
        property: 'color',
        from: `${FOCUS}.placeholder.color`
      },
    ],
  },
  {
    selector: '.p-inputtext:disabled',
    declarations: [
      {
        property: 'background',
        from: `${DISABLED}.background`
      },
      {
        property: 'color',
        from: `${DISABLED}.color`
      },
      {
        property: 'border-color',
        from: `${DISABLED}.border.color`
      },
      {
        property: 'box-shadow',
        from: `${DISABLED}.border.shadow`
      },
      {
        property: 'padding-inline',
        from: `${D}.padding.x`
      },
      {
        property: 'padding-block',
        from: `${D}.padding.y`
      },
    ],
  },
  {
    selector: '.p-inputtext:disabled::placeholder',
    declarations: [
      {
        property: 'color',
        from: `${DISABLED}.placeholder.color`
      },
    ],
  },
  {
    selector: '.p-inputtext.p-invalid',
    declarations: [
      {
        property: 'background',
        from: `${INVALID}.background`
      },
      {
        property: 'color',
        from: `${INVALID}.color`
      },
      {
        property: 'border-color',
        from: `${INVALID}.border.color`
      },
      {
        property: 'box-shadow',
        from: `${INVALID}.border.shadow`
      },
      {
        property: 'padding-inline',
        from: `${D}.padding.x`
      },
      {
        property: 'padding-block',
        from: `${D}.padding.y`
      },
    ],
  },
  {
    selector: '.p-inputtext.p-invalid::placeholder',
    declarations: [
      {
        property: 'color',
        from: `${INVALID}.placeholder.color`
      },
    ],
  },

  {
    selector: '.p-variant-filled .p-inputtext',
    declarations: [
      {
        property: 'background',
        from: `${FILLED}.background`
      },
      {
        property: 'color',
        from: `${FILLED}.color`
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext::placeholder',
    declarations: [
      {
        property: 'color',
        from: `${FILLED}.placeholder.color`
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):hover',
    declarations: [
      {
        property: 'background',
        from: `${FILLED_HOVER}.background`
      },
      {
        property: 'color',
        from: `${FILLED_HOVER}.color`
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):hover::placeholder',
    declarations: [
      {
        property: 'color',
        from: `${FILLED_HOVER}.placeholder.color`
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):focus',
    declarations: [
      {
        property: 'background',
        from: `${FILLED_FOCUS}.background`
      },
      {
        property: 'color',
        from: `${FILLED_FOCUS}.color`
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:not(:disabled):focus::placeholder',
    declarations: [
      {
        property: 'color',
        from: `${FILLED_FOCUS}.placeholder.color`
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:disabled',
    declarations: [
      {
        property: 'background',
        from: `${INPUT}.filled.disabled.defaultSeverity.background`
      },
      {
        property: 'color',
        from: `${INPUT}.filled.disabled.defaultSeverity.color`
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext:disabled::placeholder',
    declarations: [
      {
        property: 'color',
        from: `${INPUT}.filled.disabled.defaultSeverity.placeholder.color`
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext.p-invalid',
    declarations: [
      {
        property: 'background',
        from: `${INPUT}.filled.invalid.defaultSeverity.background`
      },
      {
        property: 'color',
        from: `${INPUT}.filled.invalid.defaultSeverity.color`
      },
    ],
  },
  {
    selector: '.p-variant-filled .p-inputtext.p-invalid::placeholder',
    declarations: [
      {
        property: 'color',
        from: `${INPUT}.filled.invalid.defaultSeverity.placeholder.color`
      },
    ],
  },
]
