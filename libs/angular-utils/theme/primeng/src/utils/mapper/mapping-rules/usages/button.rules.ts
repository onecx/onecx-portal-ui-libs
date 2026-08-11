import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const buttonMappingRules: MappingRule[] = [
  // ─── Primary Button Base ───────────────────────────────────────────────────
  {
    from: 'usages.button.background',
    to: 'components.button.colorScheme.{mode}.root.primary.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.color',
    to: 'components.button.colorScheme.{mode}.root.primary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.border.color',
    to: 'components.button.colorScheme.{mode}.root.primary.borderColor',
    transform: toColorString,
  },

  // ─── Primary Button Hover ──────────────────────────────────────────────────
  {
    from: 'usages.button.hover.background',
    to: 'components.button.colorScheme.{mode}.root.primary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.color',
    to: 'components.button.colorScheme.{mode}.root.primary.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.border.color',
    to: 'components.button.colorScheme.{mode}.root.primary.hoverBorderColor',
    transform: toColorString,
  },

  // ─── Primary Button Active ─────────────────────────────────────────────────
  {
    from: 'usages.button.active.background',
    to: 'components.button.colorScheme.{mode}.root.primary.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.color',
    to: 'components.button.colorScheme.{mode}.root.primary.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.border.color',
    to: 'components.button.colorScheme.{mode}.root.primary.activeBorderColor',
    transform: toColorString,
  },

  // ─── Primary Button Focus Ring ─────────────────────────────────────────────
  {
    from: 'usages.button.focusRing.color',
    to: 'components.button.colorScheme.{mode}.root.primary.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.focusRing.width',
    to: 'components.button.root.focusRing.width',
  },
  {
    from: 'usages.button.focusRing.style',
    to: 'components.button.root.focusRing.style',
  },
  {
    from: 'usages.button.focusRing.offset',
    to: 'components.button.root.focusRing.offset',
  },

  // ─── Secondary Button Base ─────────────────────────────────────────────────
  {
    from: 'usages.button.secondary.background',
    to: 'components.button.colorScheme.{mode}.root.secondary.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.color',
    to: 'components.button.colorScheme.{mode}.root.secondary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.border.color',
    to: 'components.button.colorScheme.{mode}.root.secondary.borderColor',
    transform: toColorString,
  },

  // ─── Secondary Button Hover ────────────────────────────────────────────────
  {
    from: 'usages.button.secondary.hover.background',
    to: 'components.button.colorScheme.{mode}.root.secondary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.hover.color',
    to: 'components.button.colorScheme.{mode}.root.secondary.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.hover.border.color',
    to: 'components.button.colorScheme.{mode}.root.secondary.hoverBorderColor',
    transform: toColorString,
  },

  // ─── Secondary Button Active ───────────────────────────────────────────────
  {
    from: 'usages.button.secondary.active.background',
    to: 'components.button.colorScheme.{mode}.root.secondary.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.active.color',
    to: 'components.button.colorScheme.{mode}.root.secondary.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.active.border.color',
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
    from: 'usages.button.info.background',
    to: 'components.button.colorScheme.{mode}.root.info.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.info.color',
    to: 'components.button.colorScheme.{mode}.root.info.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.info.border.color',
    to: 'components.button.colorScheme.{mode}.root.info.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.info.background',
    to: 'components.button.colorScheme.{mode}.root.info.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.info.color',
    to: 'components.button.colorScheme.{mode}.root.info.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.info.border.color',
    to: 'components.button.colorScheme.{mode}.root.info.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.info.background',
    to: 'components.button.colorScheme.{mode}.root.info.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.info.color',
    to: 'components.button.colorScheme.{mode}.root.info.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.info.border.color',
    to: 'components.button.colorScheme.{mode}.root.info.activeBorderColor',
    transform: toColorString,
  },

  // ─── Severity: Success ─────────────────────────────────────────────────────
  {
    from: 'usages.button.success.background',
    to: 'components.button.colorScheme.{mode}.root.success.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.success.color',
    to: 'components.button.colorScheme.{mode}.root.success.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.success.border.color',
    to: 'components.button.colorScheme.{mode}.root.success.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.success.background',
    to: 'components.button.colorScheme.{mode}.root.success.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.success.color',
    to: 'components.button.colorScheme.{mode}.root.success.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.success.border.color',
    to: 'components.button.colorScheme.{mode}.root.success.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.success.background',
    to: 'components.button.colorScheme.{mode}.root.success.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.success.color',
    to: 'components.button.colorScheme.{mode}.root.success.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.success.border.color',
    to: 'components.button.colorScheme.{mode}.root.success.activeBorderColor',
    transform: toColorString,
  },

  // ─── Severity: Warning -> warn ─────────────────────────────────────────────
  {
    from: 'usages.button.warning.background',
    to: 'components.button.colorScheme.{mode}.root.warn.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.warning.color',
    to: 'components.button.colorScheme.{mode}.root.warn.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.warning.border.color',
    to: 'components.button.colorScheme.{mode}.root.warn.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.warning.background',
    to: 'components.button.colorScheme.{mode}.root.warn.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.warning.color',
    to: 'components.button.colorScheme.{mode}.root.warn.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.warning.border.color',
    to: 'components.button.colorScheme.{mode}.root.warn.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.warning.background',
    to: 'components.button.colorScheme.{mode}.root.warn.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.warning.color',
    to: 'components.button.colorScheme.{mode}.root.warn.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.warning.border.color',
    to: 'components.button.colorScheme.{mode}.root.warn.activeBorderColor',
    transform: toColorString,
  },

  // ─── Severity: Danger ──────────────────────────────────────────────────────
  {
    from: 'usages.button.danger.background',
    to: 'components.button.colorScheme.{mode}.root.danger.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.danger.color',
    to: 'components.button.colorScheme.{mode}.root.danger.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.danger.border.color',
    to: 'components.button.colorScheme.{mode}.root.danger.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.danger.background',
    to: 'components.button.colorScheme.{mode}.root.danger.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.danger.color',
    to: 'components.button.colorScheme.{mode}.root.danger.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.danger.border.color',
    to: 'components.button.colorScheme.{mode}.root.danger.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.danger.background',
    to: 'components.button.colorScheme.{mode}.root.danger.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.danger.color',
    to: 'components.button.colorScheme.{mode}.root.danger.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.danger.border.color',
    to: 'components.button.colorScheme.{mode}.root.danger.activeBorderColor',
    transform: toColorString,
  },

  // ─── Severity: Contrast ────────────────────────────────────────────────────
  {
    from: 'usages.button.contrast.background',
    to: 'components.button.colorScheme.{mode}.root.contrast.background',
    transform: toColorString,
  },
  {
    from: 'usages.button.contrast.color',
    to: 'components.button.colorScheme.{mode}.root.contrast.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.contrast.border.color',
    to: 'components.button.colorScheme.{mode}.root.contrast.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.contrast.background',
    to: 'components.button.colorScheme.{mode}.root.contrast.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.contrast.color',
    to: 'components.button.colorScheme.{mode}.root.contrast.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.hover.contrast.border.color',
    to: 'components.button.colorScheme.{mode}.root.contrast.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.contrast.background',
    to: 'components.button.colorScheme.{mode}.root.contrast.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.contrast.color',
    to: 'components.button.colorScheme.{mode}.root.contrast.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.active.contrast.border.color',
    to: 'components.button.colorScheme.{mode}.root.contrast.activeBorderColor',
    transform: toColorString,
  },

  // ─── Outlined Variant ──────────────────────────────────────────────────────
  {
    from: 'usages.button.outlined.background',
    to: 'components.button.outlined.primary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.outlined.color',
    to: 'components.button.outlined.primary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.outlined.border.color',
    to: 'components.button.outlined.primary.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.outlined.hover.background',
    to: 'components.button.outlined.primary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.outlined.hover.color',
    to: 'components.button.outlined.primary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.outlined.active.background',
    to: 'components.button.outlined.primary.activeBackground',
    transform: toColorString,
  },

  // ─── Outlined Secondary ────────────────────────────────────────────────────
  {
    from: 'usages.button.secondary.outlined.background',
    to: 'components.button.outlined.secondary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.outlined.color',
    to: 'components.button.outlined.secondary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.outlined.border.color',
    to: 'components.button.outlined.secondary.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.outlined.hover.background',
    to: 'components.button.outlined.secondary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.outlined.hover.color',
    to: 'components.button.outlined.secondary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.outlined.active.background',
    to: 'components.button.outlined.secondary.activeBackground',
    transform: toColorString,
  },

  // ─── Text Variant ──────────────────────────────────────────────────────────
  {
    from: 'usages.button.text.background',
    to: 'components.button.text.primary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.text.color',
    to: 'components.button.text.primary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.text.hover.background',
    to: 'components.button.text.primary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.text.hover.color',
    to: 'components.button.text.primary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.text.active.background',
    to: 'components.button.text.primary.activeBackground',
    transform: toColorString,
  },

  // ─── Text Secondary ────────────────────────────────────────────────────────
  {
    from: 'usages.button.secondary.text.background',
    to: 'components.button.text.secondary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.text.color',
    to: 'components.button.text.secondary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.text.hover.background',
    to: 'components.button.text.secondary.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.text.hover.color',
    to: 'components.button.text.secondary.color',
    transform: toColorString,
  },
  {
    from: 'usages.button.secondary.text.active.background',
    to: 'components.button.text.secondary.activeBackground',
    transform: toColorString,
  },

  // ─── Structural, Font & Dimensional ────────────────────────────────────────
  {
    from: 'usages.button.border.radius',
    to: 'components.button.root.borderRadius',
  },
  {
    from: 'usages.button.paddingX',
    to: 'components.button.root.paddingX',
  },
  {
    from: 'usages.button.paddingY',
    to: 'components.button.root.paddingY',
  },

  // ─── Shape Overrides mapping to Aura button root ───────────────────────────
  {
    from: 'usages.button.rounded.border.radius',
    to: 'components.button.root.roundedBorderRadius',
  },
  {
    from: 'usages.button.raised.border.shadow',
    to: 'components.button.root.raisedShadow',
  },
]
