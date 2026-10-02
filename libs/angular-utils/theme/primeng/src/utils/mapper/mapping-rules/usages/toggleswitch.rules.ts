import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

export const toggleswitchMappingRules: MappingRule[] = [
  // Root - structural properties
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.border.radius',
    to: 'components.toggleswitch.root.borderRadius',
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.border.width',
    to: 'components.toggleswitch.root.borderWidth',
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.width',
    to: 'components.toggleswitch.root.width',
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.height',
    to: 'components.toggleswitch.root.height',
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.gap',
    to: 'components.toggleswitch.root.gap',
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.shadow',
    to: 'components.toggleswitch.root.shadow',
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.transitionDuration',
    to: 'components.toggleswitch.root.transitionDuration',
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.slideDuration',
    to: 'components.toggleswitch.root.slideDuration',
  },

  // Root - default state (backgrounds and colors)
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.background',
    to: 'components.toggleswitch.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.border.color',
    to: 'components.toggleswitch.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },

  // Root - hover state
  {
    from: 'usages.toggleswitch.defaultVariant.hover.slider.background',
    to: 'components.toggleswitch.colorScheme.{mode}.root.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.defaultVariant.hover.slider.border.color',
    to: 'components.toggleswitch.colorScheme.{mode}.root.hoverBorderColor',
    transform: toColorString,
  },

  // Root - checked state
  {
    from: 'usages.toggleswitch.checked.defaultState.slider.background',
    to: 'components.toggleswitch.colorScheme.{mode}.root.checkedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.checked.defaultState.slider.border.color',
    to: 'components.toggleswitch.colorScheme.{mode}.root.checkedBorderColor',
    transform: toColorString,
  },

  // Root - checked + hover state
  {
    from: 'usages.toggleswitch.checked.hover.slider.background',
    to: 'components.toggleswitch.colorScheme.{mode}.root.checkedHoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.checked.hover.slider.border.color',
    to: 'components.toggleswitch.colorScheme.{mode}.root.checkedHoverBorderColor',
    transform: toColorString,
  },

  // Root - disabled state
  {
    from: 'usages.toggleswitch.defaultVariant.disabled.slider.background',
    to: 'components.toggleswitch.colorScheme.{mode}.root.disabledBackground',
    transform: toColorString,
  },

  // Root - invalid state
  {
    from: 'usages.toggleswitch.defaultVariant.invalid.slider.border.color',
    to: 'components.toggleswitch.colorScheme.{mode}.root.invalidBorderColor',
    transform: toColorString,
  },

  // Focus ring
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.focusRing.width',
    to: 'components.toggleswitch.root.focusRing.width',
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.focusRing.style',
    to: 'components.toggleswitch.root.focusRing.style',
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.focusRing.color',
    to: 'components.toggleswitch.root.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.focusRing.offset',
    to: 'components.toggleswitch.root.focusRing.offset',
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.focusRing.shadow',
    to: 'components.toggleswitch.root.focusRing.shadow',
  },

  // Handle - structural properties
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.handle.borderRadius',
    to: 'components.toggleswitch.handle.borderRadius',
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.handle.size',
    to: 'components.toggleswitch.handle.size',
  },

  // Handle - default state
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.handle.background',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.background',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.handle.color',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.color',
    transform: toColorString,
  },

  // Handle - hover state
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.handle.background',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.handle.color',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.hoverColor',
    transform: toColorString,
  },

  // Handle - checked state
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.handle.background',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.checkedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.handle.color',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.checkedColor',
    transform: toColorString,
  },

  // Handle - checked + hover state
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.handle.background',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.checkedHoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.toggleswitch.defaultVariant.defaultState.slider.handle.color',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.checkedHoverColor',
    transform: toColorString,
  },

  // Handle - disabled state
  {
    from: 'usages.toggleswitch.defaultVariant.disabled.slider.handle.background',
    to: 'components.toggleswitch.colorScheme.{mode}.handle.disabledBackground',
    transform: toColorString,
  },
];
