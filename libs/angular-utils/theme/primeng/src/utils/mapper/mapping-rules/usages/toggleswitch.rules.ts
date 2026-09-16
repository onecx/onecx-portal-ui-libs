import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const toggleswitchMappingRules: MappingRule[] = [
  // Root - structural properties
  {
    from: 'usages.toggleswitch.border.radius',
    to: 'components.toggleswitch.root.borderRadius',
  },
  {
    from: 'usages.toggleswitch.border.width',
    to: 'components.toggleswitch.root.borderWidth',
  },
  {
    from: 'usages.toggleswitch.width',
    to: 'components.toggleswitch.root.width',
  },
  {
    from: 'usages.toggleswitch.height',
    to: 'components.toggleswitch.root.height',
  },
  {
    from: 'usages.toggleswitch.gap',
    to: 'components.toggleswitch.root.gap',
  },
  {
    from: 'usages.toggleswitch.shadow',
    to: 'components.toggleswitch.root.shadow',
  },
  {
    from: 'usages.toggleswitch.transition.duration',
    to: 'components.toggleswitch.root.transitionDuration',
  },
  {
    from: 'usages.toggleswitch.slide.duration',
    to: 'components.toggleswitch.root.slideDuration',
  },

  // Root - default state (backgrounds and colors)
  {
    from: 'usages.toggleswitch.defaultState.background',
    to: 'components.toggleswitch.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.defaultState.borderColor',
    to: 'components.toggleswitch.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },

  // Root - hover state
  {
    from: 'usages.toggleswitch.state.hover.background',
    to: 'components.toggleswitch.colorScheme.{mode}.root.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.state.hover.borderColor',
    to: 'components.toggleswitch.colorScheme.{mode}.root.hoverBorderColor',
    transform: toColorString,
  },

  // Root - checked state
  {
    from: 'usages.toggleswitch.state.checked.background',
    to: 'components.toggleswitch.colorScheme.{mode}.root.checkedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.state.checked.borderColor',
    to: 'components.toggleswitch.colorScheme.{mode}.root.checkedBorderColor',
    transform: toColorString,
  },

  // Root - checked + hover state
  {
    from: 'usages.toggleswitch.state.checked.hover.background',
    to: 'components.toggleswitch.colorScheme.{mode}.root.checkedHoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.state.checked.hover.borderColor',
    to: 'components.toggleswitch.colorScheme.{mode}.root.checkedHoverBorderColor',
    transform: toColorString,
  },

  // Root - disabled state
  {
    from: 'usages.toggleswitch.state.disabled.background',
    to: 'components.toggleswitch.colorScheme.{mode}.root.disabledBackground',
    transform: toColorString,
  },

  // Root - invalid state
  {
    from: 'usages.toggleswitch.state.invalid.borderColor',
    to: 'components.toggleswitch.colorScheme.{mode}.root.invalidBorderColor',
    transform: toColorString,
  },

  // Focus ring
  {
    from: 'usages.toggleswitch.focusRing.width',
    to: 'components.toggleswitch.root.focusRing.width',
  },
  {
    from: 'usages.toggleswitch.focusRing.style',
    to: 'components.toggleswitch.root.focusRing.style',
  },
  {
    from: 'usages.toggleswitch.focusRing.color',
    to: 'components.toggleswitch.root.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.focusRing.offset',
    to: 'components.toggleswitch.root.focusRing.offset',
  },
  {
    from: 'usages.toggleswitch.focusRing.shadow',
    to: 'components.toggleswitch.root.focusRing.shadow',
  },

  // Handle - structural properties
  {
    from: 'usages.toggleswitch.handle.borderRadius',
    to: 'components.toggleswitch.handle.borderRadius',
  },
  {
    from: 'usages.toggleswitch.handle.size',
    to: 'components.toggleswitch.handle.size',
  },

  // Handle - default state
  {
    from: 'usages.toggleswitch.handle.defaultState.background',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.background',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.handle.defaultState.color',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.color',
    transform: toColorString,
  },

  // Handle - hover state
  {
    from: 'usages.toggleswitch.handle.state.hover.background',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.handle.state.hover.color',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.hoverColor',
    transform: toColorString,
  },

  // Handle - checked state
  {
    from: 'usages.toggleswitch.handle.state.checked.background',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.checkedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.handle.state.checked.color',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.checkedColor',
    transform: toColorString,
  },

  // Handle - checked + hover state
  {
    from: 'usages.toggleswitch.handle.state.checked.hover.background',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.checkedHoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.handle.state.checked.hover.color',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.checkedHoverColor',
    transform: toColorString,
  },

  // Handle - disabled state
  {
    from: 'usages.toggleswitch.handle.state.disabled.background',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.disabledBackground',
    transform: toColorString,
  },
];
