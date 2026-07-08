import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const buttonMappingRules: MappingRule[] = [
    {
        from: 'usages.button.borderRadius',
        to: 'components.button.root.borderRadius',
    },
    {
        from: 'usages.button.roundedBorderRadius',
        to: 'components.button.root.roundedBorderRadius',
    },
    {
        from: 'usages.button.gap',
        to: 'components.button.root.gap',
    },
    {
        from: 'usages.button.paddingX',
        to: 'components.button.root.paddingX',
    },
    {
        from: 'usages.button.paddingY',
        to: 'components.button.root.paddingY',
    },
    {
        from: 'usages.button.iconOnlyWidth',
        to: 'components.button.root.iconOnlyWidth',
    },
    {
        from: 'usages.button.label.fontWeight',
        to: 'components.button.root.label.fontWeight',
    },
    {
        from: 'usages.button.raisedShadow',
        to: 'components.button.root.raisedShadow',
    },
    {
        from: 'usages.button.focusRing.color',
        to: 'components.button.colorScheme.{mode}.root.primary.focusRing.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.focusRing.shadow',
        to: 'components.button.colorScheme.{mode}.root.primary.focusRing.shadow',
    },
    {
        from: 'usages.button.badgeSize',
        to: 'components.button.root.badgeSize',
    },
    {
        from: 'usages.button.transitionDuration',
        to: 'components.button.root.transitionDuration',
    },
    {
        from: 'usages.button.disabledOpacity',
        to: 'semantic.disabledOpacity',
    },
    {
        from: 'usages.button.defaultState.background',
        to: 'components.button.colorScheme.{mode}.root.primary.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultState.borderColor',
        to: 'components.button.colorScheme.{mode}.root.primary.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultState.color',
        to: 'components.button.colorScheme.{mode}.root.primary.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.hover.background',
        to: 'components.button.colorScheme.{mode}.root.primary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.hover.borderColor',
        to: 'components.button.colorScheme.{mode}.root.primary.hoverBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.hover.color',
        to: 'components.button.colorScheme.{mode}.root.primary.hoverColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.active.background',
        to: 'components.button.colorScheme.{mode}.root.primary.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.active.borderColor',
        to: 'components.button.colorScheme.{mode}.root.primary.activeBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.active.color',
        to: 'components.button.colorScheme.{mode}.root.primary.activeColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.focus.background',
        to: 'components.button.colorScheme.{mode}.root.primary.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.focus.borderColor',
        to: 'components.button.colorScheme.{mode}.root.primary.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.focus.color',
        to: 'components.button.colorScheme.{mode}.root.primary.color',
        transform: toColorString,
    },

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
    {
        from: 'usages.button.defaultVariant.focusRing.color',
        to: 'components.button.colorScheme.{mode}.root.primary.focusRing.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.focusRing.shadow',
        to: 'components.button.colorScheme.{mode}.root.primary.focusRing.shadow',
    },
    {
        from: 'usages.button.defaultVariant.severities.primary.background',
        to: 'components.button.colorScheme.{mode}.root.primary.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.severities.primary.borderColor',
        to: 'components.button.colorScheme.{mode}.root.primary.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.severities.primary.color',
        to: 'components.button.colorScheme.{mode}.root.primary.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.severities.primary.hoverBackground',
        to: 'components.button.colorScheme.{mode}.root.primary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.severities.primary.hoverBorderColor',
        to: 'components.button.colorScheme.{mode}.root.primary.hoverBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.severities.primary.hoverColor',
        to: 'components.button.colorScheme.{mode}.root.primary.hoverColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.severities.primary.activeBackground',
        to: 'components.button.colorScheme.{mode}.root.primary.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.severities.primary.activeBorderColor',
        to: 'components.button.colorScheme.{mode}.root.primary.activeBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultVariant.severities.primary.activeColor',
        to: 'components.button.colorScheme.{mode}.root.primary.activeColor',
        transform: toColorString,
    },

    {
        from: 'usages.button.severities.secondary.background',
        to: 'components.button.colorScheme.{mode}.root.secondary.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.secondary.borderColor',
        to: 'components.button.colorScheme.{mode}.root.secondary.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.secondary.color',
        to: 'components.button.colorScheme.{mode}.root.secondary.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.secondary.hoverBackground',
        to: 'components.button.colorScheme.{mode}.root.secondary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.secondary.hoverBorderColor',
        to: 'components.button.colorScheme.{mode}.root.secondary.hoverBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.secondary.hoverColor',
        to: 'components.button.colorScheme.{mode}.root.secondary.hoverColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.secondary.activeBackground',
        to: 'components.button.colorScheme.{mode}.root.secondary.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.secondary.activeBorderColor',
        to: 'components.button.colorScheme.{mode}.root.secondary.activeBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.secondary.activeColor',
        to: 'components.button.colorScheme.{mode}.root.secondary.activeColor',
        transform: toColorString,
    },

    {
        from: 'usages.button.severities.success.background',
        to: 'components.button.colorScheme.{mode}.root.success.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.success.borderColor',
        to: 'components.button.colorScheme.{mode}.root.success.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.success.color',
        to: 'components.button.colorScheme.{mode}.root.success.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.success.hoverBackground',
        to: 'components.button.colorScheme.{mode}.root.success.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.success.hoverBorderColor',
        to: 'components.button.colorScheme.{mode}.root.success.hoverBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.success.hoverColor',
        to: 'components.button.colorScheme.{mode}.root.success.hoverColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.success.activeBackground',
        to: 'components.button.colorScheme.{mode}.root.success.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.success.activeBorderColor',
        to: 'components.button.colorScheme.{mode}.root.success.activeBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.success.activeColor',
        to: 'components.button.colorScheme.{mode}.root.success.activeColor',
        transform: toColorString,
    },

    {
        from: 'usages.button.severities.info.background',
        to: 'components.button.colorScheme.{mode}.root.info.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.info.borderColor',
        to: 'components.button.colorScheme.{mode}.root.info.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.info.color',
        to: 'components.button.colorScheme.{mode}.root.info.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.info.hoverBackground',
        to: 'components.button.colorScheme.{mode}.root.info.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.info.hoverBorderColor',
        to: 'components.button.colorScheme.{mode}.root.info.hoverBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.info.hoverColor',
        to: 'components.button.colorScheme.{mode}.root.info.hoverColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.info.activeBackground',
        to: 'components.button.colorScheme.{mode}.root.info.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.info.activeBorderColor',
        to: 'components.button.colorScheme.{mode}.root.info.activeBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.info.activeColor',
        to: 'components.button.colorScheme.{mode}.root.info.activeColor',
        transform: toColorString,
    },

    {
        from: 'usages.button.severities.warning.background',
        to: 'components.button.colorScheme.{mode}.root.warn.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.warning.borderColor',
        to: 'components.button.colorScheme.{mode}.root.warn.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.warning.color',
        to: 'components.button.colorScheme.{mode}.root.warn.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.warning.hoverBackground',
        to: 'components.button.colorScheme.{mode}.root.warn.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.warning.hoverBorderColor',
        to: 'components.button.colorScheme.{mode}.root.warn.hoverBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.warning.hoverColor',
        to: 'components.button.colorScheme.{mode}.root.warn.hoverColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.warning.activeBackground',
        to: 'components.button.colorScheme.{mode}.root.warn.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.warning.activeBorderColor',
        to: 'components.button.colorScheme.{mode}.root.warn.activeBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.warning.activeColor',
        to: 'components.button.colorScheme.{mode}.root.warn.activeColor',
        transform: toColorString,
    },

    {
        from: 'usages.button.severities.danger.background',
        to: 'components.button.colorScheme.{mode}.root.danger.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.danger.borderColor',
        to: 'components.button.colorScheme.{mode}.root.danger.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.danger.color',
        to: 'components.button.colorScheme.{mode}.root.danger.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.danger.hoverBackground',
        to: 'components.button.colorScheme.{mode}.root.danger.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.danger.hoverBorderColor',
        to: 'components.button.colorScheme.{mode}.root.danger.hoverBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.danger.hoverColor',
        to: 'components.button.colorScheme.{mode}.root.danger.hoverColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.danger.activeBackground',
        to: 'components.button.colorScheme.{mode}.root.danger.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.danger.activeBorderColor',
        to: 'components.button.colorScheme.{mode}.root.danger.activeBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.danger.activeColor',
        to: 'components.button.colorScheme.{mode}.root.danger.activeColor',
        transform: toColorString,
    },

    {
        from: 'usages.button.severities.contrast.background',
        to: 'components.button.colorScheme.{mode}.root.contrast.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.contrast.borderColor',
        to: 'components.button.colorScheme.{mode}.root.contrast.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.contrast.color',
        to: 'components.button.colorScheme.{mode}.root.contrast.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.contrast.hoverBackground',
        to: 'components.button.colorScheme.{mode}.root.contrast.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.contrast.hoverBorderColor',
        to: 'components.button.colorScheme.{mode}.root.contrast.hoverBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.contrast.hoverColor',
        to: 'components.button.colorScheme.{mode}.root.contrast.hoverColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.contrast.activeBackground',
        to: 'components.button.colorScheme.{mode}.root.contrast.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.contrast.activeBorderColor',
        to: 'components.button.colorScheme.{mode}.root.contrast.activeBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.contrast.activeColor',
        to: 'components.button.colorScheme.{mode}.root.contrast.activeColor',
        transform: toColorString,
    },

    {
        from: 'usages.button.severities.help.background',
        to: 'components.button.colorScheme.{mode}.root.help.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.help.borderColor',
        to: 'components.button.colorScheme.{mode}.root.help.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.help.color',
        to: 'components.button.colorScheme.{mode}.root.help.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.help.hoverBackground',
        to: 'components.button.colorScheme.{mode}.root.help.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.help.hoverBorderColor',
        to: 'components.button.colorScheme.{mode}.root.help.hoverBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.help.hoverColor',
        to: 'components.button.colorScheme.{mode}.root.help.hoverColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.help.activeBackground',
        to: 'components.button.colorScheme.{mode}.root.help.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.help.activeBorderColor',
        to: 'components.button.colorScheme.{mode}.root.help.activeBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.severities.help.activeColor',
        to: 'components.button.colorScheme.{mode}.root.help.activeColor',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.outlined.severities.primary.hoverBackground',
        to: 'components.button.colorScheme.{mode}.outlined.primary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.primary.activeBackground',
        to: 'components.button.colorScheme.{mode}.outlined.primary.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.primary.borderColor',
        to: 'components.button.colorScheme.{mode}.outlined.primary.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.primary.color',
        to: 'components.button.colorScheme.{mode}.outlined.primary.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.outlined.severities.secondary.hoverBackground',
        to: 'components.button.colorScheme.{mode}.outlined.secondary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.secondary.activeBackground',
        to: 'components.button.colorScheme.{mode}.outlined.secondary.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.secondary.borderColor',
        to: 'components.button.colorScheme.{mode}.outlined.secondary.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.secondary.color',
        to: 'components.button.colorScheme.{mode}.outlined.secondary.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.outlined.severities.success.hoverBackground',
        to: 'components.button.colorScheme.{mode}.outlined.success.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.success.activeBackground',
        to: 'components.button.colorScheme.{mode}.outlined.success.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.success.borderColor',
        to: 'components.button.colorScheme.{mode}.outlined.success.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.success.color',
        to: 'components.button.colorScheme.{mode}.outlined.success.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.outlined.severities.info.hoverBackground',
        to: 'components.button.colorScheme.{mode}.outlined.info.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.info.activeBackground',
        to: 'components.button.colorScheme.{mode}.outlined.info.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.info.borderColor',
        to: 'components.button.colorScheme.{mode}.outlined.info.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.info.color',
        to: 'components.button.colorScheme.{mode}.outlined.info.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.outlined.severities.warning.hoverBackground',
        to: 'components.button.colorScheme.{mode}.outlined.warn.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.warning.activeBackground',
        to: 'components.button.colorScheme.{mode}.outlined.warn.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.warning.borderColor',
        to: 'components.button.colorScheme.{mode}.outlined.warn.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.warning.color',
        to: 'components.button.colorScheme.{mode}.outlined.warn.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.outlined.severities.danger.hoverBackground',
        to: 'components.button.colorScheme.{mode}.outlined.danger.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.danger.activeBackground',
        to: 'components.button.colorScheme.{mode}.outlined.danger.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.danger.borderColor',
        to: 'components.button.colorScheme.{mode}.outlined.danger.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.danger.color',
        to: 'components.button.colorScheme.{mode}.outlined.danger.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.outlined.severities.contrast.hoverBackground',
        to: 'components.button.colorScheme.{mode}.outlined.contrast.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.contrast.activeBackground',
        to: 'components.button.colorScheme.{mode}.outlined.contrast.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.contrast.borderColor',
        to: 'components.button.colorScheme.{mode}.outlined.contrast.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.contrast.color',
        to: 'components.button.colorScheme.{mode}.outlined.contrast.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.outlined.severities.help.hoverBackground',
        to: 'components.button.colorScheme.{mode}.outlined.help.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.help.activeBackground',
        to: 'components.button.colorScheme.{mode}.outlined.help.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.help.borderColor',
        to: 'components.button.colorScheme.{mode}.outlined.help.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.outlined.severities.help.color',
        to: 'components.button.colorScheme.{mode}.outlined.help.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.text.severities.primary.hoverBackground',
        to: 'components.button.colorScheme.{mode}.text.primary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.primary.activeBackground',
        to: 'components.button.colorScheme.{mode}.text.primary.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.primary.color',
        to: 'components.button.colorScheme.{mode}.text.primary.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.text.severities.secondary.hoverBackground',
        to: 'components.button.colorScheme.{mode}.text.secondary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.secondary.activeBackground',
        to: 'components.button.colorScheme.{mode}.text.secondary.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.secondary.color',
        to: 'components.button.colorScheme.{mode}.text.secondary.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.text.severities.success.hoverBackground',
        to: 'components.button.colorScheme.{mode}.text.success.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.success.activeBackground',
        to: 'components.button.colorScheme.{mode}.text.success.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.success.color',
        to: 'components.button.colorScheme.{mode}.text.success.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.text.severities.info.hoverBackground',
        to: 'components.button.colorScheme.{mode}.text.info.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.info.activeBackground',
        to: 'components.button.colorScheme.{mode}.text.info.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.info.color',
        to: 'components.button.colorScheme.{mode}.text.info.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.text.severities.warning.hoverBackground',
        to: 'components.button.colorScheme.{mode}.text.warn.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.warning.activeBackground',
        to: 'components.button.colorScheme.{mode}.text.warn.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.warning.color',
        to: 'components.button.colorScheme.{mode}.text.warn.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.text.severities.danger.hoverBackground',
        to: 'components.button.colorScheme.{mode}.text.danger.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.danger.activeBackground',
        to: 'components.button.colorScheme.{mode}.text.danger.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.danger.color',
        to: 'components.button.colorScheme.{mode}.text.danger.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.text.severities.contrast.hoverBackground',
        to: 'components.button.colorScheme.{mode}.text.contrast.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.contrast.activeBackground',
        to: 'components.button.colorScheme.{mode}.text.contrast.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.contrast.color',
        to: 'components.button.colorScheme.{mode}.text.contrast.color',
        transform: toColorString,
    },

    {
        from: 'usages.button.variants.text.severities.help.hoverBackground',
        to: 'components.button.colorScheme.{mode}.text.help.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.help.activeBackground',
        to: 'components.button.colorScheme.{mode}.text.help.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.variants.text.severities.help.color',
        to: 'components.button.colorScheme.{mode}.text.help.color',
        transform: toColorString,
    },
];
