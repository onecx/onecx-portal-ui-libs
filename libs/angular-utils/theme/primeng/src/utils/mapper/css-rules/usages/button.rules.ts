import type { CssRule } from '../../mapper.types'

// CSS rules for button properties that have no PrimeNG preset equivalent.
// PrimeNG presets cover: base/hover/active colors per severity, outlined/text/link
// sections, and structural root tokens. The following states/shapes require CSS:

export const buttonCssRules: CssRule[] = [
  // ─── Primary Focus State ────────────────────────────────────────────────────
  {
    selector: '.p-button:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.focus.background' },
      { property: 'color', from: 'usages.button.focus.color' },
      { property: 'border-color', from: 'usages.button.focus.border.color' },
    ],
  },

  // ─── Primary Disabled State ────────────────────────────────────────────────
  {
    selector: '.p-button:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.disabled.background' },
      { property: 'color', from: 'usages.button.disabled.color' },
      { property: 'border-color', from: 'usages.button.disabled.border.color' },
    ],
  },

  // ─── Primary Focus Severity: Info ──────────────────────────────────────────
  {
    selector: '.p-button-info:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.focus.info.background' },
      { property: 'color', from: 'usages.button.focus.info.color' },
      { property: 'border-color', from: 'usages.button.focus.info.border.color' },
    ],
  },

  // ─── Primary Focus Severity: Success ───────────────────────────────────────
  {
    selector: '.p-button-success:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.focus.success.background' },
      { property: 'color', from: 'usages.button.focus.success.color' },
      { property: 'border-color', from: 'usages.button.focus.success.border.color' },
    ],
  },

  // ─── Primary Focus Severity: Warning ───────────────────────────────────────
  {
    selector: '.p-button-warning:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.focus.warning.background' },
      { property: 'color', from: 'usages.button.focus.warning.color' },
      { property: 'border-color', from: 'usages.button.focus.warning.border.color' },
    ],
  },

  // ─── Primary Focus Severity: Danger ────────────────────────────────────────
  {
    selector: '.p-button-danger:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.focus.danger.background' },
      { property: 'color', from: 'usages.button.focus.danger.color' },
      { property: 'border-color', from: 'usages.button.focus.danger.border.color' },
    ],
  },

  // ─── Primary Focus Severity: Contrast ──────────────────────────────────────
  {
    selector: '.p-button-contrast:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.focus.contrast.background' },
      { property: 'color', from: 'usages.button.focus.contrast.color' },
      { property: 'border-color', from: 'usages.button.focus.contrast.border.color' },
    ],
  },

  // ─── Primary Disabled Severity: Info ───────────────────────────────────────
  {
    selector: '.p-button-info:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.disabled.info.background' },
      { property: 'color', from: 'usages.button.disabled.info.color' },
      { property: 'border-color', from: 'usages.button.disabled.info.border.color' },
    ],
  },

  // ─── Primary Disabled Severity: Success ────────────────────────────────────
  {
    selector: '.p-button-success:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.disabled.success.background' },
      { property: 'color', from: 'usages.button.disabled.success.color' },
      { property: 'border-color', from: 'usages.button.disabled.success.border.color' },
    ],
  },

  // ─── Primary Disabled Severity: Warning ────────────────────────────────────
  {
    selector: '.p-button-warning:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.disabled.warning.background' },
      { property: 'color', from: 'usages.button.disabled.warning.color' },
      { property: 'border-color', from: 'usages.button.disabled.warning.border.color' },
    ],
  },

  // ─── Primary Disabled Severity: Danger ─────────────────────────────────────
  {
    selector: '.p-button-danger:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.disabled.danger.background' },
      { property: 'color', from: 'usages.button.disabled.danger.color' },
      { property: 'border-color', from: 'usages.button.disabled.danger.border.color' },
    ],
  },

  // ─── Primary Disabled Severity: Contrast ───────────────────────────────────
  {
    selector: '.p-button-contrast:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.disabled.contrast.background' },
      { property: 'color', from: 'usages.button.disabled.contrast.color' },
      { property: 'border-color', from: 'usages.button.disabled.contrast.border.color' },
    ],
  },

  // ─── Secondary Focus State ─────────────────────────────────────────────────
  {
    selector: '.p-button-secondary:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.secondary.focus.background' },
      { property: 'color', from: 'usages.button.secondary.focus.color' },
      { property: 'border-color', from: 'usages.button.secondary.focus.border.color' },
    ],
  },

  // ─── Secondary Disabled State ──────────────────────────────────────────────
  {
    selector: '.p-button-secondary:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.secondary.disabled.background' },
      { property: 'color', from: 'usages.button.secondary.disabled.color' },
      { property: 'border-color', from: 'usages.button.secondary.disabled.border.color' },
    ],
  },

  // ─── Rounded Shape ─────────────────────────────────────────────────────────
  {
    selector: '.p-button-rounded',
    declarations: [
      { property: 'border-radius', from: 'usages.button.rounded.border.radius' },
    ],
  },

  // ─── Rounded Focus ─────────────────────────────────────────────────────────
  {
    selector: '.p-button-rounded:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.rounded.focus.background' },
      { property: 'color', from: 'usages.button.rounded.focus.color' },
      { property: 'border-color', from: 'usages.button.rounded.focus.border.color' },
    ],
  },

  // ─── Rounded Disabled ──────────────────────────────────────────────────────
  {
    selector: '.p-button-rounded:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.rounded.disabled.background' },
      { property: 'color', from: 'usages.button.rounded.disabled.color' },
      { property: 'border-color', from: 'usages.button.rounded.disabled.border.color' },
    ],
  },

  // ─── Raised Shadow ─────────────────────────────────────────────────────────
  {
    selector: '.p-button-raised',
    declarations: [
      { property: 'box-shadow', from: 'usages.button.raised.border.shadow' },
    ],
  },

  // ─── Raised Focus ──────────────────────────────────────────────────────────
  {
    selector: '.p-button-raised:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.raised.focus.background' },
      { property: 'color', from: 'usages.button.raised.focus.color' },
      { property: 'border-color', from: 'usages.button.raised.focus.border.color' },
      { property: 'box-shadow', from: 'usages.button.raised.focus.border.shadow' },
    ],
  },

  // ─── Raised Disabled ───────────────────────────────────────────────────────
  {
    selector: '.p-button-raised:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.raised.disabled.background' },
      { property: 'color', from: 'usages.button.raised.disabled.color' },
      { property: 'border-color', from: 'usages.button.raised.disabled.border.color' },
      { property: 'box-shadow', from: 'usages.button.raised.disabled.border.shadow' },
    ],
  },

  // ─── Font Properties ───────────────────────────────────────────────────────
  {
    selector: '.p-button',
    declarations: [
      { property: 'font-weight', from: 'usages.button.font.weight' },
      { property: 'line-height', from: 'usages.button.font.lineHeight' },
      { property: 'letter-spacing', from: 'usages.button.font.letterSpacing' },
      { property: 'font-style', from: 'usages.button.font.style' },
    ],
  },
]
