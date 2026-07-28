import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const menubarMappingRules: MappingRule[] = [
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.background.color',
    to: 'components.menubar.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.color',
    to: 'components.menubar.colorScheme.{mode}.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.border.color',
    to: 'components.menubar.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.border.radius',
    to: 'components.menubar.root.borderRadius',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.padding',
    to: 'components.menubar.root.padding',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.gap',
    to: 'components.menubar.root.gap',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.transition.duration',
    to: 'components.menubar.root.transitionDuration',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.item.defaultVariant.defaultState.defaultSeverity.color',
    to: 'components.menubar.colorScheme.{mode}.item.color',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.item.defaultVariant.defaultState.defaultSeverity.icon.color',
    to: 'components.menubar.colorScheme.{mode}.item.icon.color',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.item.padding',
    to: 'components.menubar.item.padding',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.item.defaultVariant.defaultState.defaultSeverity.border.radius',
    to: 'components.menubar.item.borderRadius',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.item.gap',
    to: 'components.menubar.item.gap',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.item.defaultVariant.state.focus.defaultSeverity.background.color',
    to: 'components.menubar.colorScheme.{mode}.item.focusBackground',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.item.defaultVariant.state.focus.defaultSeverity.color',
    to: 'components.menubar.colorScheme.{mode}.item.focusColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.item.defaultVariant.state.focus.defaultSeverity.icon.color',
    to: 'components.menubar.colorScheme.{mode}.item.icon.focusColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.item.defaultVariant.state.active.defaultSeverity.background.color',
    to: 'components.menubar.colorScheme.{mode}.item.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.item.defaultVariant.state.active.defaultSeverity.color',
    to: 'components.menubar.colorScheme.{mode}.item.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.item.defaultVariant.state.active.defaultSeverity.icon.color',
    to: 'components.menubar.colorScheme.{mode}.item.icon.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.defaultState.defaultSeverity.background.color',
    to: 'components.menubar.colorScheme.{mode}.submenu.background',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.defaultState.defaultSeverity.border.color',
    to: 'components.menubar.colorScheme.{mode}.submenu.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.defaultState.defaultSeverity.border.radius',
    to: 'components.menubar.submenu.borderRadius',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.defaultState.defaultSeverity.shadow',
    to: 'components.menubar.submenu.shadow',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.submenu.padding',
    to: 'components.menubar.submenu.padding',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.submenu.gap',
    to: 'components.menubar.submenu.gap',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.submenu.screenSettings.xs.indent',
    to: 'components.menubar.submenu.mobileIndent',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.defaultState.defaultSeverity.icon.size',
    to: 'components.menubar.submenu.icon.size',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.defaultState.defaultSeverity.icon.color',
    to: 'components.menubar.colorScheme.{mode}.submenu.icon.color',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.state.focus.defaultSeverity.icon.color',
    to: 'components.menubar.colorScheme.{mode}.submenu.icon.focusColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.state.active.defaultSeverity.icon.color',
    to: 'components.menubar.colorScheme.{mode}.submenu.icon.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.separator.color',
    to: 'components.menubar.separator.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.mobileButton.defaultVariant.defaultState.defaultSeverity.border.radius',
    to: 'components.menubar.mobileButton.borderRadius',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.mobileButton.defaultVariant.defaultState.defaultSeverity.size',
    to: 'components.menubar.mobileButton.size',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.mobileButton.defaultVariant.defaultState.defaultSeverity.color',
    to: 'components.menubar.colorScheme.{mode}.mobileButton.color',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.mobileButton.defaultVariant.state.hover.defaultSeverity.color',
    to: 'components.menubar.colorScheme.{mode}.mobileButton.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.mobileButton.defaultVariant.state.hover.defaultSeverity.background.color',
    to: 'components.menubar.colorScheme.{mode}.mobileButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.mobileButton.focusRing.width',
    to: 'components.menubar.mobileButton.focusRing.width',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.mobileButton.focusRing.style',
    to: 'components.menubar.mobileButton.focusRing.style',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.mobileButton.focusRing.color',
    to: 'components.menubar.mobileButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.mobileButton.focusRing.offset',
    to: 'components.menubar.mobileButton.focusRing.offset',
  },
  {
    from: 'usages.menubar.defaultVariant.defaultState.defaultSeverity.mobileButton.focusRing.shadow',
    to: 'components.menubar.mobileButton.focusRing.shadow',
  },
];