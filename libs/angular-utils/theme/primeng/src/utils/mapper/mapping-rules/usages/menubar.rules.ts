import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const menubarMappingRules: MappingRule[] = [
  {
    from: 'usages.menubar.background',
    to: 'components.menubar.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.color',
    to: 'components.menubar.colorScheme.{mode}.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.border.color',
    to: 'components.menubar.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.border.radius',
    to: 'components.menubar.root.borderRadius',
  },
  {
    from: 'usages.menubar.padding',
    to: 'components.menubar.root.padding',
  },
  {
    from: 'usages.menubar.gap',
    to: 'components.menubar.root.gap',
  },
  {
    from: 'usages.menubar.transition.duration',
    to: 'components.menubar.root.transitionDuration',
  },
  {
    from: 'usages.menubar.item.defaultState.color',
    to: 'components.menubar.colorScheme.{mode}.item.color',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.item.defaultState.icon.color',
    to: 'components.menubar.colorScheme.{mode}.item.icon.color',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.item.base.padding',
    to: 'components.menubar.baseItem.padding',
  },
  {
    from: 'usages.menubar.item.base.borderRadius',
    to: 'components.menubar.baseItem.borderRadius',
  },
  {
    from: 'usages.menubar.item.padding',
    to: 'components.menubar.item.padding',
  },
  {
    from: 'usages.menubar.item.borderRadius',
    to: 'components.menubar.item.borderRadius',
  },
  {
    from: 'usages.menubar.item.gap',
    to: 'components.menubar.item.gap',
  },
  {
    from: 'usages.menubar.item.state.focus.background',
    to: 'components.menubar.colorScheme.{mode}.item.focusBackground',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.item.state.focus.color',
    to: 'components.menubar.colorScheme.{mode}.item.focusColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.item.state.focus.icon.color',
    to: 'components.menubar.colorScheme.{mode}.item.icon.focusColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.item.state.active.background',
    to: 'components.menubar.colorScheme.{mode}.item.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.item.state.active.color',
    to: 'components.menubar.colorScheme.{mode}.item.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.item.state.active.icon.color',
    to: 'components.menubar.colorScheme.{mode}.item.icon.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.item.focusRing.width',
    to: 'components.menubar.item.focusRing.width',
  },
  {
    from: 'usages.menubar.item.focusRing.style',
    to: 'components.menubar.item.focusRing.style',
  },
  {
    from: 'usages.menubar.item.focusRing.color',
    to: 'components.menubar.item.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.item.focusRing.offset',
    to: 'components.menubar.item.focusRing.offset',
  },
  {
    from: 'usages.menubar.item.focusRing.shadow',
    to: 'components.menubar.item.focusRing.shadow',
  },
  {
    from: 'usages.menubar.submenu.background',
    to: 'components.menubar.colorScheme.{mode}.submenu.background',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.submenu.border.color',
    to: 'components.menubar.colorScheme.{mode}.submenu.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.submenu.border.radius',
    to: 'components.menubar.submenu.borderRadius',
  },
  {
    from: 'usages.menubar.submenu.shadow',
    to: 'components.menubar.submenu.shadow',
  },
  {
    from: 'usages.menubar.submenu.padding',
    to: 'components.menubar.submenu.padding',
  },
  {
    from: 'usages.menubar.submenu.gap',
    to: 'components.menubar.submenu.gap',
  },
  {
    from: 'usages.menubar.submenu.mobile.indent',
    to: 'components.menubar.submenu.mobileIndent',
  },
  {
    from: 'usages.menubar.submenu.icon.size',
    to: 'components.menubar.submenu.icon.size',
  },
  {
    from: 'usages.menubar.submenu.icon.defaultState.color',
    to: 'components.menubar.colorScheme.{mode}.submenu.icon.color',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.submenu.icon.state.focus.color',
    to: 'components.menubar.colorScheme.{mode}.submenu.icon.focusColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.submenu.icon.state.active.color',
    to: 'components.menubar.colorScheme.{mode}.submenu.icon.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.separator.border.color',
    to: 'components.menubar.separator.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.mobileButton.borderRadius',
    to: 'components.menubar.mobileButton.borderRadius',
  },
  {
    from: 'usages.menubar.mobileButton.size',
    to: 'components.menubar.mobileButton.size',
  },
  {
    from: 'usages.menubar.mobileButton.defaultState.color',
    to: 'components.menubar.colorScheme.{mode}.mobileButton.color',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.mobileButton.state.hover.color',
    to: 'components.menubar.colorScheme.{mode}.mobileButton.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.mobileButton.state.hover.background',
    to: 'components.menubar.colorScheme.{mode}.mobileButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.mobileButton.focusRing.width',
    to: 'components.menubar.mobileButton.focusRing.width',
  },
  {
    from: 'usages.menubar.mobileButton.focusRing.style',
    to: 'components.menubar.mobileButton.focusRing.style',
  },
  {
    from: 'usages.menubar.mobileButton.focusRing.color',
    to: 'components.menubar.mobileButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.menubar.mobileButton.focusRing.offset',
    to: 'components.menubar.mobileButton.focusRing.offset',
  },
  {
    from: 'usages.menubar.mobileButton.focusRing.shadow',
    to: 'components.menubar.mobileButton.focusRing.shadow',
  },
];