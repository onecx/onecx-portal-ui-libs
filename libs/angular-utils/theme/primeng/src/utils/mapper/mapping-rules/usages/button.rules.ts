import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const buttonMappingRules: MappingRule[] = [
  // ─── Primary Button Base ───────────────────────────────────────────────────
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.defaultSeverity.background',
    to: 'components.button.colorScheme.{mode}.root.primary.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.defaultSeverity.color',
    to: 'components.button.colorScheme.{mode}.root.primary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.color',
    to: 'components.button.colorScheme.{mode}.root.primary.borderColor',
    transform: toColorString,
  },

  // ─── Primary Button Hover ──────────────────────────────────────────────────
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.defaultSeverity.background',
    to: 'components.button.colorScheme.{mode}.root.primary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.defaultSeverity.color',
    to: 'components.button.colorScheme.{mode}.root.primary.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.defaultSeverity.border.color',
    to: 'components.button.colorScheme.{mode}.root.primary.hoverBorderColor',
    transform: toColorString,
  },

  // ─── Primary Button Active ─────────────────────────────────────────────────
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.defaultSeverity.background',
    to: 'components.button.colorScheme.{mode}.root.primary.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.defaultSeverity.color',
    to: 'components.button.colorScheme.{mode}.root.primary.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.defaultSeverity.border.color',
    to: 'components.button.colorScheme.{mode}.root.primary.activeBorderColor',
    transform: toColorString,
  },

  // ─── Primary Button Focus Ring ─────────────────────────────────────────────
  {
    from: 'usages.button.defaultVariant.focusRing.color',
    to: 'components.button.colorScheme.{mode}.root.primary.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.focusRing.width',
    to: 'components.button.root.focusRing.width',
  },
  {
    from: 'usages.button.defaultVariant.focusRing.style',
    to: 'components.button.root.focusRing.style',
  },
  {
    from: 'usages.button.defaultVariant.focusRing.offset',
    to: 'components.button.root.focusRing.offset',
  },

  // ─── Secondary Button Base ─────────────────────────────────────────────────
  {
    from: 'usages.button.secondary.defaultVariant.defaultState.defaultSeverity.background',
    to: 'components.button.colorScheme.{mode}.root.secondary.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.defaultVariant.defaultState.defaultSeverity.color',
    to: 'components.button.colorScheme.{mode}.root.secondary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.defaultVariant.defaultState.defaultSeverity.border.color',
    to: 'components.button.colorScheme.{mode}.root.secondary.borderColor',
    transform: toColorString,
  },

  // ─── Secondary Button Hover ────────────────────────────────────────────────
  {
    from: 'usages.button.secondary.defaultVariant.hover.defaultSeverity.background',
    to: 'components.button.colorScheme.{mode}.root.secondary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.defaultVariant.hover.defaultSeverity.color',
    to: 'components.button.colorScheme.{mode}.root.secondary.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.defaultVariant.hover.defaultSeverity.border.color',
    to: 'components.button.colorScheme.{mode}.root.secondary.hoverBorderColor',
    transform: toColorString,
  },

  // ─── Secondary Button Active ───────────────────────────────────────────────
  {
    from: 'usages.button.secondary.defaultVariant.active.defaultSeverity.background',
    to: 'components.button.colorScheme.{mode}.root.secondary.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.defaultVariant.active.defaultSeverity.color',
    to: 'components.button.colorScheme.{mode}.root.secondary.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.defaultVariant.active.defaultSeverity.border.color',
    to: 'components.button.colorScheme.{mode}.root.secondary.activeBorderColor',
    transform: toColorString,
  },

  // ─── Secondary Button Focus Ring ───────────────────────────────────────────
  {
    from: 'usages.button.secondary.focusRing.color',
    to: 'components.button.colorScheme.{mode}.root.secondary.focusRing.color',
    transform: toColorString,
  },

  // ─── Severity: Info ────────────────────────────────────────────────────────
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.info.background',
    to: 'components.button.colorScheme.{mode}.root.info.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.info.color',
    to: 'components.button.colorScheme.{mode}.root.info.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.info.border.color',
    to: 'components.button.colorScheme.{mode}.root.info.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.info.background',
    to: 'components.button.colorScheme.{mode}.root.info.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.info.color',
    to: 'components.button.colorScheme.{mode}.root.info.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.info.border.color',
    to: 'components.button.colorScheme.{mode}.root.info.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.info.background',
    to: 'components.button.colorScheme.{mode}.root.info.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.info.color',
    to: 'components.button.colorScheme.{mode}.root.info.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.info.border.color',
    to: 'components.button.colorScheme.{mode}.root.info.activeBorderColor',
    transform: toColorString,
  },

  // ─── Severity: Success ─────────────────────────────────────────────────────
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.success.background',
    to: 'components.button.colorScheme.{mode}.root.success.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.success.color',
    to: 'components.button.colorScheme.{mode}.root.success.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.success.border.color',
    to: 'components.button.colorScheme.{mode}.root.success.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.success.background',
    to: 'components.button.colorScheme.{mode}.root.success.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.success.color',
    to: 'components.button.colorScheme.{mode}.root.success.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.success.border.color',
    to: 'components.button.colorScheme.{mode}.root.success.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.success.background',
    to: 'components.button.colorScheme.{mode}.root.success.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.success.color',
    to: 'components.button.colorScheme.{mode}.root.success.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.success.border.color',
    to: 'components.button.colorScheme.{mode}.root.success.activeBorderColor',
    transform: toColorString,
  },

  // ─── Severity: Warning -> warn ─────────────────────────────────────────────
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.warning.background',
    to: 'components.button.colorScheme.{mode}.root.warn.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.warning.color',
    to: 'components.button.colorScheme.{mode}.root.warn.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.warning.border.color',
    to: 'components.button.colorScheme.{mode}.root.warn.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.warning.background',
    to: 'components.button.colorScheme.{mode}.root.warn.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.warning.color',
    to: 'components.button.colorScheme.{mode}.root.warn.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.warning.border.color',
    to: 'components.button.colorScheme.{mode}.root.warn.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.warning.background',
    to: 'components.button.colorScheme.{mode}.root.warn.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.warning.color',
    to: 'components.button.colorScheme.{mode}.root.warn.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.warning.border.color',
    to: 'components.button.colorScheme.{mode}.root.warn.activeBorderColor',
    transform: toColorString,
  },

  // ─── Severity: Danger ──────────────────────────────────────────────────────
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.danger.background',
    to: 'components.button.colorScheme.{mode}.root.danger.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.danger.color',
    to: 'components.button.colorScheme.{mode}.root.danger.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.danger.border.color',
    to: 'components.button.colorScheme.{mode}.root.danger.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.danger.background',
    to: 'components.button.colorScheme.{mode}.root.danger.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.danger.color',
    to: 'components.button.colorScheme.{mode}.root.danger.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.danger.border.color',
    to: 'components.button.colorScheme.{mode}.root.danger.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.danger.background',
    to: 'components.button.colorScheme.{mode}.root.danger.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.danger.color',
    to: 'components.button.colorScheme.{mode}.root.danger.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.danger.border.color',
    to: 'components.button.colorScheme.{mode}.root.danger.activeBorderColor',
    transform: toColorString,
  },

  // ─── Severity: Contrast ────────────────────────────────────────────────────
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.contrast.background',
    to: 'components.button.colorScheme.{mode}.root.contrast.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.contrast.color',
    to: 'components.button.colorScheme.{mode}.root.contrast.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.contrast.border.color',
    to: 'components.button.colorScheme.{mode}.root.contrast.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.contrast.background',
    to: 'components.button.colorScheme.{mode}.root.contrast.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.contrast.color',
    to: 'components.button.colorScheme.{mode}.root.contrast.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.hover.contrast.border.color',
    to: 'components.button.colorScheme.{mode}.root.contrast.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.contrast.background',
    to: 'components.button.colorScheme.{mode}.root.contrast.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.contrast.color',
    to: 'components.button.colorScheme.{mode}.root.contrast.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.defaultVariant.active.contrast.border.color',
    to: 'components.button.colorScheme.{mode}.root.contrast.activeBorderColor',
    transform: toColorString,
  },

  // ─── Outlined Variant ──────────────────────────────────────────────────────
  {
    from: 'usages.button.defaultVariant.outlined.defaultState.defaultSeverity.background',
    to: 'components.button.outlined.primary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.outlined.defaultState.defaultSeverity.color',
    to: 'components.button.outlined.primary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.outlined.defaultState.defaultSeverity.border.color',
    to: 'components.button.outlined.primary.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.outlined.hover.defaultSeverity.background',
    to: 'components.button.outlined.primary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.outlined.hover.defaultSeverity.color',
    to: 'components.button.outlined.primary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.outlined.active.defaultSeverity.background',
    to: 'components.button.outlined.primary.activeBackground',
    transform: toColorString,
  },

  // ─── Outlined Secondary ────────────────────────────────────────────────────
  {
    from: 'usages.button.secondary.outlined.defaultState.defaultSeverity.background',
    to: 'components.button.outlined.secondary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.outlined.defaultState.defaultSeverity.color',
    to: 'components.button.outlined.secondary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.outlined.defaultState.defaultSeverity.border.color',
    to: 'components.button.outlined.secondary.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.outlined.hover.defaultSeverity.background',
    to: 'components.button.outlined.secondary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.outlined.hover.defaultSeverity.color',
    to: 'components.button.outlined.secondary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.outlined.active.defaultSeverity.background',
    to: 'components.button.outlined.secondary.activeBackground',
    transform: toColorString,
  },

  // ─── Text Variant ──────────────────────────────────────────────────────────
  {
    from: 'usages.button.defaultVariant.text.defaultState.defaultSeverity.background',
    to: 'components.button.text.primary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.text.defaultState.defaultSeverity.color',
    to: 'components.button.text.primary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.text.hover.defaultSeverity.background',
    to: 'components.button.text.primary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.text.hover.defaultSeverity.color',
    to: 'components.button.text.primary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.defaultVariant.text.active.defaultSeverity.background',
    to: 'components.button.text.primary.activeBackground',
    transform: toColorString,
  },

  // ─── Text Secondary ────────────────────────────────────────────────────────
  {
    from: 'usages.button.secondary.text.defaultState.defaultSeverity.background',
    to: 'components.button.text.secondary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.text.defaultState.defaultSeverity.color',
    to: 'components.button.text.secondary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.text.hover.defaultSeverity.background',
    to: 'components.button.text.secondary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.text.hover.defaultSeverity.color',
    to: 'components.button.text.secondary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.text.active.defaultSeverity.background',
    to: 'components.button.text.secondary.activeBackground',
    transform: toColorString,
  },

  // ─── Structural, Font & Dimensional ────────────────────────────────────────
  {
    from: 'usages.button.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.radius',
    to: 'components.button.root.borderRadius',
  },
  {
    from: 'usages.button.defaultVariant.paddingX',
    to: 'components.button.root.paddingX',
  },
  {
    from: 'usages.button.defaultVariant.paddingY',
    to: 'components.button.root.paddingY',
  },

  // ─── Shape Overrides mapping to Aura button root ───────────────────────────
  {
    from: 'usages.button.defaultVariant.rounded.defaultState.defaultSeverity.border.radius',
    to: 'components.button.root.roundedBorderRadius',
  },
  {
    from: 'usages.button.defaultVariant.raised.defaultState.defaultSeverity.border.shadow',
    to: 'components.button.root.raisedShadow',
  },
]
