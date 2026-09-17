import type { CssRule } from '../../mapper.types'

// CSS rules for button properties that have no PrimeNG preset equivalent.
// PrimeNG presets cover: base/hover/active colors per severity, outlined/text/link
// sections, and structural root tokens. The following states/shapes require CSS:

export const buttonCssRules: CssRule[] = [
  // ─── Primary Focus State ────────────────────────────────────────────────────
  {
    selector: '.p-button:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.defaultVariant.focus.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.defaultVariant.defaultVariant.focus.defaultSeverity.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.defaultVariant.focus.defaultSeverity.border.color' },
    ],
  },

  // ─── Primary Disabled State ─────────────────────────────────────────
  {
    selector: '.p-button:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.defaultVariant.disabled.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.defaultVariant.defaultVariant.disabled.defaultSeverity.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.defaultVariant.disabled.defaultSeverity.border.color' },
    ],
  },

  // ─── Primary Focus Severity: Info ──────────────────────────────────────────
  {
    selector: '.p-button-info:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.defaultVariant.focus.info.background' },
      { property: 'color', from: 'usages.button.defaultVariant.defaultVariant.focus.info.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.defaultVariant.focus.info.border.color' },
    ],
  },

  // ─── Primary Focus Severity: Success ───────────────────────────────────────
  {
    selector: '.p-button-success:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.defaultVariant.focus.success.background' },
      { property: 'color', from: 'usages.button.defaultVariant.defaultVariant.focus.success.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.defaultVariant.focus.success.border.color' },
    ],
  },

  // ─── Primary Focus Severity: Warning ───────────────────────────────────────
  {
    selector: '.p-button-warning:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.defaultVariant.focus.warning.background' },
      { property: 'color', from: 'usages.button.defaultVariant.defaultVariant.focus.warning.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.defaultVariant.focus.warning.border.color' },
    ],
  },

  // ─── Primary Focus Severity: Danger ────────────────────────────────────────
  {
    selector: '.p-button-danger:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.defaultVariant.focus.danger.background' },
      { property: 'color', from: 'usages.button.defaultVariant.defaultVariant.focus.danger.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.defaultVariant.focus.danger.border.color' },
    ],
  },

  // ─── Primary Focus Severity: Contrast ──────────────────────────────────────
  {
    selector: '.p-button-contrast:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.defaultVariant.focus.contrast.background' },
      { property: 'color', from: 'usages.button.defaultVariant.defaultVariant.focus.contrast.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.defaultVariant.focus.contrast.border.color' },
    ],
  },

  // ─── Primary Disabled Severity: Info ───────────────────────────────────────
  {
    selector: '.p-button-info:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.defaultVariant.disabled.info.background' },
      { property: 'color', from: 'usages.button.defaultVariant.defaultVariant.disabled.info.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.defaultVariant.disabled.info.border.color' },
    ],
  },

  // ─── Primary Disabled Severity: Success ────────────────────────────────────
  {
    selector: '.p-button-success:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.defaultVariant.disabled.success.background' },
      { property: 'color', from: 'usages.button.defaultVariant.defaultVariant.disabled.success.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.defaultVariant.disabled.success.border.color' },
    ],
  },

  // ─── Primary Disabled Severity: Warning ────────────────────────────────────
  {
    selector: '.p-button-warning:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.defaultVariant.disabled.warning.background' },
      { property: 'color', from: 'usages.button.defaultVariant.defaultVariant.disabled.warning.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.defaultVariant.disabled.warning.border.color' },
    ],
  },

  // ─── Primary Disabled Severity: Danger ─────────────────────────────────────
  {
    selector: '.p-button-danger:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.defaultVariant.disabled.danger.background' },
      { property: 'color', from: 'usages.button.defaultVariant.defaultVariant.disabled.danger.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.defaultVariant.disabled.danger.border.color' },
    ],
  },

  // ─── Primary Disabled Severity: Contrast ───────────────────────────────────
  {
    selector: '.p-button-contrast:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.defaultVariant.disabled.contrast.background' },
      { property: 'color', from: 'usages.button.defaultVariant.defaultVariant.disabled.contrast.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.defaultVariant.disabled.contrast.border.color' },
    ],
  },

  // ─── Secondary Focus State ─────────────────────────────────────────────────
  {
    selector: '.p-button-secondary:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.secondary.defaultVariant.focus.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.secondary.defaultVariant.focus.defaultSeverity.color' },
      { property: 'border-color', from: 'usages.button.secondary.defaultVariant.focus.defaultSeverity.border.color' },
    ],
  },

  // ─── Secondary Disabled State ──────────────────────────────────────
  {
    selector: '.p-button-secondary:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.secondary.defaultVariant.disabled.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.secondary.defaultVariant.disabled.defaultSeverity.color' },
      {
        property: 'border-color',
        from: 'usages.button.secondary.defaultVariant.disabled.defaultSeverity.border.color',
      },
    ],
  },

  // ─── Rounded Shape ─────────────────────────────────────────────────────────
  {
    selector: '.p-button-rounded',
    declarations: [
      { property: 'border-radius', from: 'usages.button.defaultVariant.rounded.defaultState.defaultSeverity.border.radius' },
    ],
  },

  // ─── Rounded Focus ─────────────────────────────────────────────────────────
  {
    selector: '.p-button-rounded:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.rounded.focus.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.defaultVariant.rounded.focus.defaultSeverity.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.rounded.focus.defaultSeverity.border.color' },
    ],
  },

  // ─── Rounded Disabled ──────────────────────────────────────────────────────
  {
    selector: '.p-button-rounded:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.rounded.disabled.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.defaultVariant.rounded.disabled.defaultSeverity.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.rounded.disabled.defaultSeverity.border.color' },
    ],
  },

  // ─── IconOnly Shape ────────────────────────────────────────────────────────
  {
    selector: '.p-button-icon-only',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.iconOnly.defaultState.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.defaultVariant.iconOnly.defaultState.defaultSeverity.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.iconOnly.defaultState.defaultSeverity.border.color' },
      { property: 'border-radius', from: 'usages.button.defaultVariant.iconOnly.defaultState.defaultSeverity.border.radius' },
    ],
  },

  // ─── IconOnly Focus ────────────────────────────────────────────────────────
  {
    selector: '.p-button-icon-only:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.iconOnly.focus.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.defaultVariant.iconOnly.focus.defaultSeverity.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.iconOnly.focus.defaultSeverity.border.color' },
    ],
  },

  // ─── IconOnly Disabled ─────────────────────────────────────────────────────
  {
    selector: '.p-button-icon-only:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.iconOnly.disabled.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.defaultVariant.iconOnly.disabled.defaultSeverity.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.iconOnly.disabled.defaultSeverity.border.color' },
    ],
  },

  // ─── Secondary IconOnly Base ───────────────────────────────────────────────
  {
    selector: '.p-button-secondary.p-button-icon-only',
    declarations: [
      { property: 'background', from: 'usages.button.secondary.iconOnly.defaultState.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.secondary.iconOnly.defaultState.defaultSeverity.color' },
      { property: 'border-color', from: 'usages.button.secondary.iconOnly.defaultState.defaultSeverity.border.color' },
      {
        property: 'border-radius',
        from: 'usages.button.secondary.iconOnly.defaultState.defaultSeverity.border.radius',
      },
    ],
  },

  // ─── Secondary IconOnly Focus ──────────────────────────────────────────────
  {
    selector: '.p-button-secondary.p-button-icon-only:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.secondary.iconOnly.focus.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.secondary.iconOnly.focus.defaultSeverity.color' },
      { property: 'border-color', from: 'usages.button.secondary.iconOnly.focus.defaultSeverity.border.color' },
    ],
  },

  // ─── Secondary IconOnly Disabled ───────────────────────────────────────────
  {
    selector: '.p-button-secondary.p-button-icon-only:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.secondary.iconOnly.disabled.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.secondary.iconOnly.disabled.defaultSeverity.color' },
      { property: 'border-color', from: 'usages.button.secondary.iconOnly.disabled.defaultSeverity.border.color' },
    ],
  },

  // ─── Raised Shadow ─────────────────────────────────────────────────────────
  {
    selector: '.p-button-raised',
    declarations: [{ property: 'box-shadow', from: 'usages.button.defaultVariant.raised.defaultState.defaultSeverity.border.shadow' }],
  },

  // ─── Raised Focus ──────────────────────────────────────────────────────────
  {
    selector: '.p-button-raised:not(:disabled):focus',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.raised.focus.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.defaultVariant.raised.focus.defaultSeverity.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.raised.focus.defaultSeverity.border.color' },
      { property: 'box-shadow', from: 'usages.button.defaultVariant.raised.focus.defaultSeverity.border.shadow' },
    ],
  },

  // ─── Raised Disabled ───────────────────────────────────────────────────────
  {
    selector: '.p-button-raised:disabled',
    declarations: [
      { property: 'background', from: 'usages.button.defaultVariant.raised.disabled.defaultSeverity.background' },
      { property: 'color', from: 'usages.button.defaultVariant.raised.disabled.defaultSeverity.color' },
      { property: 'border-color', from: 'usages.button.defaultVariant.raised.disabled.defaultSeverity.border.color' },
      { property: 'box-shadow', from: 'usages.button.defaultVariant.raised.disabled.defaultSeverity.border.shadow' },
    ],
  },

  // ─── Font Properties ───────────────────────────────────────────────────────
  {
    selector: '.p-button',
    declarations: [
      { property: 'font-weight', from: 'usages.button.defaultVariant.font.weight' },
      { property: 'line-height', from: 'usages.button.defaultVariant.font.lineHeight' },
      { property: 'letter-spacing', from: 'usages.button.defaultVariant.font.letterSpacing' },
      { property: 'font-style', from: 'usages.button.defaultVariant.font.style' },
    ],
  },

  // ─── Size Variant - sm ─────────────────────────────────────────────────────
  {
    selector: '.p-button-sm',
    declarations: [
      { property: 'font-size', from: 'usages.button.defaultVariant.sm.font.size' },
      { property: 'padding-left', from: 'usages.button.defaultVariant.sm.paddingX' },
      { property: 'padding-right', from: 'usages.button.defaultVariant.sm.paddingX' },
      { property: 'padding-top', from: 'usages.button.defaultVariant.sm.paddingY' },
      { property: 'padding-bottom', from: 'usages.button.defaultVariant.sm.paddingY' },
    ],
  },

  // ─── Size Variant - lg ─────────────────────────────────────────────────────
  {
    selector: '.p-button-lg',
    declarations: [
      { property: 'font-size', from: 'usages.button.defaultVariant.lg.font.size' },
      { property: 'padding-left', from: 'usages.button.defaultVariant.lg.paddingX' },
      { property: 'padding-right', from: 'usages.button.defaultVariant.lg.paddingX' },
      { property: 'padding-top', from: 'usages.button.defaultVariant.lg.paddingY' },
      { property: 'padding-bottom', from: 'usages.button.defaultVariant.lg.paddingY' },
    ],
  },

  // ─── Secondary Size Variant - sm ───────────────────────────────────────────
  {
    selector: '.p-button-secondary.p-button-sm',
    declarations: [
      { property: 'font-size', from: 'usages.button.secondary.sm.font.size' },
      { property: 'padding-left', from: 'usages.button.secondary.sm.paddingX' },
      { property: 'padding-right', from: 'usages.button.secondary.sm.paddingX' },
      { property: 'padding-top', from: 'usages.button.secondary.sm.paddingY' },
      { property: 'padding-bottom', from: 'usages.button.secondary.sm.paddingY' },
    ],
  },

  // ─── Secondary Size Variant - lg ───────────────────────────────────────────
  {
    selector: '.p-button-secondary.p-button-lg',
    declarations: [
      { property: 'font-size', from: 'usages.button.secondary.lg.font.size' },
      { property: 'padding-left', from: 'usages.button.secondary.lg.paddingX' },
      { property: 'padding-right', from: 'usages.button.secondary.lg.paddingX' },
      { property: 'padding-top', from: 'usages.button.secondary.lg.paddingY' },
      { property: 'padding-bottom', from: 'usages.button.secondary.lg.paddingY' },
    ],
  },
]
