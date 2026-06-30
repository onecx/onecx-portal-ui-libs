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
        from: 'usages.button.sm.fontSize',
        to: 'components.button.root.sm.fontSize',
    },
    {
        from: 'usages.button.sm.paddingX',
        to: 'components.button.root.sm.paddingX',
    },
    {
        from: 'usages.button.sm.paddingY',
        to: 'components.button.root.sm.paddingY',
    },
    {
        from: 'usages.button.sm.iconOnlyWidth',
        to: 'components.button.root.sm.iconOnlyWidth',
    },
    {
        from: 'usages.button.lg.fontSize',
        to: 'components.button.root.lg.fontSize',
    },
    {
        from: 'usages.button.lg.paddingX',
        to: 'components.button.root.lg.paddingX',
    },
    {
        from: 'usages.button.lg.paddingY',
        to: 'components.button.root.lg.paddingY',
    },
    {
        from: 'usages.button.lg.iconOnlyWidth',
        to: 'components.button.root.lg.iconOnlyWidth',
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
        to: 'components.button.root.primary.focusRing.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.focusRing.shadow',
        to: 'components.button.root.primary.focusRing.shadow',
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
        to: 'components.button.root.primary.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultState.borderColor',
        to: 'components.button.root.primary.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.defaultState.color',
        to: 'components.button.root.primary.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.hover.background',
        to: 'components.button.root.primary.hoverBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.hover.borderColor',
        to: 'components.button.root.primary.hoverBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.hover.color',
        to: 'components.button.root.primary.hoverColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.active.background',
        to: 'components.button.root.primary.activeBackground',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.active.borderColor',
        to: 'components.button.root.primary.activeBorderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.active.color',
        to: 'components.button.root.primary.activeColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.focus.background',
        to: 'components.button.root.primary.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.focus.borderColor',
        to: 'components.button.root.primary.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.state.focus.color',
        to: 'components.button.root.primary.color',
        transform: toColorString,
    },
];
