import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const buttonMappingRules: MappingRule[] = [
    // Root properties
    {
        from: 'usages.button.roundedBorderRadius',
        to: 'components.button.root.roundedBorderRadius',
    },
    {
        from: 'usages.button.raisedShadow',
        to: 'components.button.root.raisedShadow',
    },
    {
        from: 'usages.button.badgeSize',
        to: 'components.button.root.badgeSize',
    },
    {
        from: 'usages.button.transition.duration',
        to: 'components.button.root.transitionDuration',
    },

    // Default display variant - layout
    {
        from: 'usages.button.defaultVariant.border.radius',
        to: 'components.button.root.borderRadius',
    },
    {
        from: 'usages.button.defaultVariant.layout.gap',
        to: 'components.button.root.gap',
    },
    {
        from: 'usages.button.defaultVariant.layout.paddingX',
        to: 'components.button.root.paddingX',
    },
    {
        from: 'usages.button.defaultVariant.layout.paddingY',
        to: 'components.button.root.paddingY',
    },
    {
        from: 'usages.button.defaultVariant.layout.iconOnlyWidth',
        to: 'components.button.root.iconOnlyWidth',
    },
    {
        from: 'usages.button.defaultVariant.text.fontWeight',
        to: 'components.button.root.label.fontWeight',
    },

    // Default display variant - focusRing
    {
        from: 'usages.button.defaultVariant.focusRing.color',
        to: 'components.button.colorScheme.{mode}.root.primary.focusRing.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.focusRing.shadow',
        to: 'components.button.colorScheme.{mode}.root.primary.focusRing.shadow',
    },

    // Sizes - sm
    {
        from: 'usages.button.sizes.sm.fontSize',
        to: 'components.button.root.sm.fontSize',
    },
    {
        from: 'usages.button.sizes.sm.paddingX',
        to: 'components.button.root.sm.paddingX',
    },
    {
        from: 'usages.button.sizes.sm.paddingY',
        to: 'components.button.root.sm.paddingY',
    },
    {
        from: 'usages.button.sizes.sm.iconOnlyWidth',
        to: 'components.button.root.sm.iconOnlyWidth',
    },

    // Sizes - lg
    {
        from: 'usages.button.sizes.lg.fontSize',
        to: 'components.button.root.lg.fontSize',
    },
    {
        from: 'usages.button.sizes.lg.paddingX',
        to: 'components.button.root.lg.paddingX',
    },
    {
        from: 'usages.button.sizes.lg.paddingY',
        to: 'components.button.root.lg.paddingY',
    },
    {
        from: 'usages.button.sizes.lg.iconOnlyWidth',
        to: 'components.button.root.lg.iconOnlyWidth',
    },

    // Primary severity - default state
    {
        from: 'usages.button.defaultVariant.defaultState.defaultSeverity.background',
        to: 'components.button.colorScheme.{mode}.root.primary.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.defaultSeverity.color',
        to: 'components.button.colorScheme.{mode}.root.primary.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.defaultSeverity.border.color',
        to: 'components.button.colorScheme.{mode}.root.primary.borderColor',
        transform: toColorString,
    },

    // Primary severity - hover state
    {
        from: 'usages.button.defaultVariant.state.hover.defaultSeverity.background',
        to: 'components.button.colorScheme.{mode}.root.primary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.hover.defaultSeverity.color',
        to: 'components.button.colorScheme.{mode}.root.primary.hoverColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.hover.defaultSeverity.border.color',
        to: 'components.button.colorScheme.{mode}.root.primary.hoverBorderColor',
        transform: toColorString,
    },

    // Primary severity - active state
    {
        from: 'usages.button.defaultVariant.state.active.defaultSeverity.background',
        to: 'components.button.colorScheme.{mode}.root.primary.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.active.defaultSeverity.color',
        to: 'components.button.colorScheme.{mode}.root.primary.activeColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.active.defaultSeverity.border.color',
        to: 'components.button.colorScheme.{mode}.root.primary.activeBorderColor',
        transform: toColorString,
    },

    // Secondary severity - default state
    {
        from: 'usages.button.defaultVariant.defaultState.severity.secondary.background',
        to: 'components.button.colorScheme.{mode}.root.secondary.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.secondary.color',
        to: 'components.button.colorScheme.{mode}.root.secondary.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.secondary.border.color',
        to: 'components.button.colorScheme.{mode}.root.secondary.borderColor',
        transform: toColorString,
    },

    // Secondary severity - hover state
    {
        from: 'usages.button.defaultVariant.state.hover.severity.secondary.background',
        to: 'components.button.colorScheme.{mode}.root.secondary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.hover.severity.secondary.color',
        to: 'components.button.colorScheme.{mode}.root.secondary.hoverColor',
        transform: toColorString,
    },

    // Secondary severity - active state
    {
        from: 'usages.button.defaultVariant.state.active.severity.secondary.background',
        to: 'components.button.colorScheme.{mode}.root.secondary.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.active.severity.secondary.color',
        to: 'components.button.colorScheme.{mode}.root.secondary.activeColor',
        transform: toColorString,
    },

    // Success severity - default state
    {
        from: 'usages.button.defaultVariant.defaultState.severity.success.background',
        to: 'components.button.colorScheme.{mode}.root.success.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.success.color',
        to: 'components.button.colorScheme.{mode}.root.success.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.success.border.color',
        to: 'components.button.colorScheme.{mode}.root.success.borderColor',
        transform: toColorString,
    },

    // Success severity - hover state
    {
        from: 'usages.button.defaultVariant.state.hover.severity.success.background',
        to: 'components.button.colorScheme.{mode}.root.success.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.hover.severity.success.color',
        to: 'components.button.colorScheme.{mode}.root.success.hoverColor',
        transform: toColorString,
    },

    // Success severity - active state
    {
        from: 'usages.button.defaultVariant.state.active.severity.success.background',
        to: 'components.button.colorScheme.{mode}.root.success.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.active.severity.success.color',
        to: 'components.button.colorScheme.{mode}.root.success.activeColor',
        transform: toColorString,
    },

    // Info severity - default state
    {
        from: 'usages.button.defaultVariant.defaultState.severity.info.background',
        to: 'components.button.colorScheme.{mode}.root.info.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.info.color',
        to: 'components.button.colorScheme.{mode}.root.info.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.info.border.color',
        to: 'components.button.colorScheme.{mode}.root.info.borderColor',
        transform: toColorString,
    },

    // Info severity - hover state
    {
        from: 'usages.button.defaultVariant.state.hover.severity.info.background',
        to: 'components.button.colorScheme.{mode}.root.info.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.hover.severity.info.color',
        to: 'components.button.colorScheme.{mode}.root.info.hoverColor',
        transform: toColorString,
    },

    // Info severity - active state
    {
        from: 'usages.button.defaultVariant.state.active.severity.info.background',
        to: 'components.button.colorScheme.{mode}.root.info.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.active.severity.info.color',
        to: 'components.button.colorScheme.{mode}.root.info.activeColor',
        transform: toColorString,
    },

    // Warning severity - default state (maps to PrimeNG "warn")
    {
        from: 'usages.button.defaultVariant.defaultState.severity.warning.background',
        to: 'components.button.colorScheme.{mode}.root.warn.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.warning.color',
        to: 'components.button.colorScheme.{mode}.root.warn.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.warning.border.color',
        to: 'components.button.colorScheme.{mode}.root.warn.borderColor',
        transform: toColorString,
    },

    // Warning severity - hover state
    {
        from: 'usages.button.defaultVariant.state.hover.severity.warning.background',
        to: 'components.button.colorScheme.{mode}.root.warn.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.hover.severity.warning.color',
        to: 'components.button.colorScheme.{mode}.root.warn.hoverColor',
        transform: toColorString,
    },

    // Warning severity - active state
    {
        from: 'usages.button.defaultVariant.state.active.severity.warning.background',
        to: 'components.button.colorScheme.{mode}.root.warn.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.active.severity.warning.color',
        to: 'components.button.colorScheme.{mode}.root.warn.activeColor',
        transform: toColorString,
    },

    // Danger severity - default state
    {
        from: 'usages.button.defaultVariant.defaultState.severity.danger.background',
        to: 'components.button.colorScheme.{mode}.root.danger.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.danger.color',
        to: 'components.button.colorScheme.{mode}.root.danger.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.danger.border.color',
        to: 'components.button.colorScheme.{mode}.root.danger.borderColor',
        transform: toColorString,
    },

    // Danger severity - hover state
    {
        from: 'usages.button.defaultVariant.state.hover.severity.danger.background',
        to: 'components.button.colorScheme.{mode}.root.danger.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.hover.severity.danger.color',
        to: 'components.button.colorScheme.{mode}.root.danger.hoverColor',
        transform: toColorString,
    },

    // Danger severity - active state
    {
        from: 'usages.button.defaultVariant.state.active.severity.danger.background',
        to: 'components.button.colorScheme.{mode}.root.danger.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.active.severity.danger.color',
        to: 'components.button.colorScheme.{mode}.root.danger.activeColor',
        transform: toColorString,
    },

    // Contrast severity - default state
    {
        from: 'usages.button.defaultVariant.defaultState.severity.contrast.background',
        to: 'components.button.colorScheme.{mode}.root.contrast.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.contrast.color',
        to: 'components.button.colorScheme.{mode}.root.contrast.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.contrast.border.color',
        to: 'components.button.colorScheme.{mode}.root.contrast.borderColor',
        transform: toColorString,
    },

    // Contrast severity - hover state
    {
        from: 'usages.button.defaultVariant.state.hover.severity.contrast.background',
        to: 'components.button.colorScheme.{mode}.root.contrast.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.hover.severity.contrast.color',
        to: 'components.button.colorScheme.{mode}.root.contrast.hoverColor',
        transform: toColorString,
    },

    // Contrast severity - active state
    {
        from: 'usages.button.defaultVariant.state.active.severity.contrast.background',
        to: 'components.button.colorScheme.{mode}.root.contrast.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.active.severity.contrast.color',
        to: 'components.button.colorScheme.{mode}.root.contrast.activeColor',
        transform: toColorString,
    },

    // Help severity - default state
    {
        from: 'usages.button.defaultVariant.defaultState.severity.help.background',
        to: 'components.button.colorScheme.{mode}.root.help.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.help.color',
        to: 'components.button.colorScheme.{mode}.root.help.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.defaultState.severity.help.border.color',
        to: 'components.button.colorScheme.{mode}.root.help.borderColor',
        transform: toColorString,
    },

    // Help severity - hover state
    {
        from: 'usages.button.defaultVariant.state.hover.severity.help.background',
        to: 'components.button.colorScheme.{mode}.root.help.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.hover.severity.help.color',
        to: 'components.button.colorScheme.{mode}.root.help.hoverColor',
        transform: toColorString,
    },

    // Help severity - active state
    {
        from: 'usages.button.defaultVariant.state.active.severity.help.background',
        to: 'components.button.colorScheme.{mode}.root.help.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.state.active.severity.help.color',
        to: 'components.button.colorScheme.{mode}.root.help.activeColor',
        transform: toColorString,
    },

    // Outlined variant - primary severity
    {
        from: 'usages.button.variants.outlined.defaultState.defaultSeverity.border.color',
        to: 'components.button.colorScheme.{mode}.outlined.primary.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.defaultState.defaultSeverity.color',
        to: 'components.button.colorScheme.{mode}.outlined.primary.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.hover.defaultSeverity.background',
        to: 'components.button.colorScheme.{mode}.outlined.primary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.active.defaultSeverity.background',
        to: 'components.button.colorScheme.{mode}.outlined.primary.activeBackground',
        transform: toColorString,
    },

    // Outlined variant - secondary severity
    {
        from: 'usages.button.variants.outlined.defaultState.severity.secondary.border.color',
        to: 'components.button.colorScheme.{mode}.outlined.secondary.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.defaultState.severity.secondary.color',
        to: 'components.button.colorScheme.{mode}.outlined.secondary.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.hover.severity.secondary.background',
        to: 'components.button.colorScheme.{mode}.outlined.secondary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.active.severity.secondary.background',
        to: 'components.button.colorScheme.{mode}.outlined.secondary.activeBackground',
        transform: toColorString,
    },

    // Outlined variant - success severity
    {
        from: 'usages.button.variants.outlined.defaultState.severity.success.border.color',
        to: 'components.button.colorScheme.{mode}.outlined.success.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.defaultState.severity.success.color',
        to: 'components.button.colorScheme.{mode}.outlined.success.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.hover.severity.success.background',
        to: 'components.button.colorScheme.{mode}.outlined.success.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.active.severity.success.background',
        to: 'components.button.colorScheme.{mode}.outlined.success.activeBackground',
        transform: toColorString,
    },

    // Outlined variant - info severity
    {
        from: 'usages.button.variants.outlined.defaultState.severity.info.border.color',
        to: 'components.button.colorScheme.{mode}.outlined.info.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.defaultState.severity.info.color',
        to: 'components.button.colorScheme.{mode}.outlined.info.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.hover.severity.info.background',
        to: 'components.button.colorScheme.{mode}.outlined.info.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.active.severity.info.background',
        to: 'components.button.colorScheme.{mode}.outlined.info.activeBackground',
        transform: toColorString,
    },

    // Outlined variant - warning severity (maps to PrimeNG "warn")
    {
        from: 'usages.button.variants.outlined.defaultState.severity.warning.border.color',
        to: 'components.button.colorScheme.{mode}.outlined.warn.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.defaultState.severity.warning.color',
        to: 'components.button.colorScheme.{mode}.outlined.warn.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.hover.severity.warning.background',
        to: 'components.button.colorScheme.{mode}.outlined.warn.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.active.severity.warning.background',
        to: 'components.button.colorScheme.{mode}.outlined.warn.activeBackground',
        transform: toColorString,
    },

    // Outlined variant - danger severity
    {
        from: 'usages.button.variants.outlined.defaultState.severity.danger.border.color',
        to: 'components.button.colorScheme.{mode}.outlined.danger.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.defaultState.severity.danger.color',
        to: 'components.button.colorScheme.{mode}.outlined.danger.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.hover.severity.danger.background',
        to: 'components.button.colorScheme.{mode}.outlined.danger.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.active.severity.danger.background',
        to: 'components.button.colorScheme.{mode}.outlined.danger.activeBackground',
        transform: toColorString,
    },

    // Outlined variant - contrast severity
    {
        from: 'usages.button.variants.outlined.defaultState.severity.contrast.border.color',
        to: 'components.button.colorScheme.{mode}.outlined.contrast.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.defaultState.severity.contrast.color',
        to: 'components.button.colorScheme.{mode}.outlined.contrast.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.hover.severity.contrast.background',
        to: 'components.button.colorScheme.{mode}.outlined.contrast.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.active.severity.contrast.background',
        to: 'components.button.colorScheme.{mode}.outlined.contrast.activeBackground',
        transform: toColorString,
    },

    // Outlined variant - help severity
    {
        from: 'usages.button.variants.outlined.defaultState.severity.help.border.color',
        to: 'components.button.colorScheme.{mode}.outlined.help.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.defaultState.severity.help.color',
        to: 'components.button.colorScheme.{mode}.outlined.help.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.hover.severity.help.background',
        to: 'components.button.colorScheme.{mode}.outlined.help.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.state.active.severity.help.background',
        to: 'components.button.colorScheme.{mode}.outlined.help.activeBackground',
        transform: toColorString,
    },

    // Text variant - primary severity
    {
        from: 'usages.button.variants.text.defaultState.defaultSeverity.color',
        to: 'components.button.colorScheme.{mode}.text.primary.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.hover.defaultSeverity.background',
        to: 'components.button.colorScheme.{mode}.text.primary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.active.defaultSeverity.background',
        to: 'components.button.colorScheme.{mode}.text.primary.activeBackground',
        transform: toColorString,
    },

    // Text variant - secondary severity
    {
        from: 'usages.button.variants.text.defaultState.severity.secondary.color',
        to: 'components.button.colorScheme.{mode}.text.secondary.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.hover.severity.secondary.background',
        to: 'components.button.colorScheme.{mode}.text.secondary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.active.severity.secondary.background',
        to: 'components.button.colorScheme.{mode}.text.secondary.activeBackground',
        transform: toColorString,
    },

    // Text variant - success severity
    {
        from: 'usages.button.variants.text.defaultState.severity.success.color',
        to: 'components.button.colorScheme.{mode}.text.success.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.hover.severity.success.background',
        to: 'components.button.colorScheme.{mode}.text.success.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.active.severity.success.background',
        to: 'components.button.colorScheme.{mode}.text.success.activeBackground',
        transform: toColorString,
    },

    // Text variant - info severity
    {
        from: 'usages.button.variants.text.defaultState.severity.info.color',
        to: 'components.button.colorScheme.{mode}.text.info.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.hover.severity.info.background',
        to: 'components.button.colorScheme.{mode}.text.info.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.active.severity.info.background',
        to: 'components.button.colorScheme.{mode}.text.info.activeBackground',
        transform: toColorString,
    },

    // Text variant - warning severity (maps to PrimeNG "warn")
    {
        from: 'usages.button.variants.text.defaultState.severity.warning.color',
        to: 'components.button.colorScheme.{mode}.text.warn.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.hover.severity.warning.background',
        to: 'components.button.colorScheme.{mode}.text.warn.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.active.severity.warning.background',
        to: 'components.button.colorScheme.{mode}.text.warn.activeBackground',
        transform: toColorString,
    },

    // Text variant - danger severity
    {
        from: 'usages.button.variants.text.defaultState.severity.danger.color',
        to: 'components.button.colorScheme.{mode}.text.danger.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.hover.severity.danger.background',
        to: 'components.button.colorScheme.{mode}.text.danger.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.active.severity.danger.background',
        to: 'components.button.colorScheme.{mode}.text.danger.activeBackground',
        transform: toColorString,
    },

    // Text variant - contrast severity
    {
        from: 'usages.button.variants.text.defaultState.severity.contrast.color',
        to: 'components.button.colorScheme.{mode}.text.contrast.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.hover.severity.contrast.background',
        to: 'components.button.colorScheme.{mode}.text.contrast.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.active.severity.contrast.background',
        to: 'components.button.colorScheme.{mode}.text.contrast.activeBackground',
        transform: toColorString,
    },

    // Text variant - help severity
    {
        from: 'usages.button.variants.text.defaultState.severity.help.color',
        to: 'components.button.colorScheme.{mode}.text.help.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.hover.severity.help.background',
        to: 'components.button.colorScheme.{mode}.text.help.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.state.active.severity.help.background',
        to: 'components.button.colorScheme.{mode}.text.help.activeBackground',
        transform: toColorString,
    },

    // Link variant
    {
        from: 'usages.button.variants.link.defaultState.color',
        to: 'components.button.colorScheme.{mode}.link.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.link.hover.color',
        to: 'components.button.colorScheme.{mode}.link.hoverColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.link.active.color',
        to: 'components.button.colorScheme.{mode}.link.activeColor',
        transform: toColorString,
    },
];