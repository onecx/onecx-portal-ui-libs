import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'
export const togglebuttonMappingRules: MappingRule[] = [
  // Root properties
  {
    from: 'usages.togglebutton.gap',
    to: 'components.togglebutton.root.gap',
  },
  {
    from: 'usages.togglebutton.font.weight',
    to: 'components.togglebutton.root.fontWeight',
  },
  {
    from: 'usages.togglebutton.border.radius',
    to: 'components.togglebutton.root.borderRadius',
  },
  {
    from: 'usages.togglebutton.transitionDuration',
    to: 'components.togglebutton.root.transitionDuration',
  },

  // Colors - default (unchecked)
  {
    from: 'usages.togglebutton.background',
    to: 'components.togglebutton.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.border.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },
  // Colors - hover state
  {
    from: 'usages.togglebutton.hover.background',
    to: 'components.togglebutton.colorScheme.{mode}.root.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.hover.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.hoverColor',
    transform: toColorString,
  },

  // Colors - focus state (handled via CSS rules)
  {
    from: 'usages.togglebutton.focus.background',
    to: 'components.togglebutton.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.focus.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.color',
    transform: toColorString,
  },

  // Colors - checked variant (default checked state)
  {
    from: 'usages.togglebutton.checked.background',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.checked.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.checked.border.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedBorderColor',
    transform: toColorString,
  },
  // Checked variant states - PrimeNG doesn't have separate tokens for these,
  // so we map them to the base checked properties or use CSS rules
  {
    from: 'usages.togglebutton.checked.hover.background',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.checked.hover.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.checked.hover.border.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.checked.focus.background',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.checked.focus.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.checked.focus.border.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.checked.disabled.background',
    to: 'components.togglebutton.colorScheme.{mode}.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.checked.disabled.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.disabledColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.checked.disabled.border.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.disabledBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.checked.invalid.background',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.checked.invalid.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.checked.invalid.border.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.invalidBorderColor',
    transform: toColorString,
  },
  // Colors - disabled state
  {
    from: 'usages.togglebutton.disabled.background',
    to: 'components.togglebutton.colorScheme.{mode}.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.disabled.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.disabledColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.disabled.border.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.disabledBorderColor',
    transform: toColorString,
  },
  // Colors - invalid state
  {
    from: 'usages.togglebutton.invalid.border.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.invalidBorderColor',
    transform: toColorString,
  },
  // Focus ring
  {
    from: 'usages.togglebutton.focusRing.width',
    to: 'components.togglebutton.root.focusRing.width',
  },
  {
    from: 'usages.togglebutton.focusRing.style',
    to: 'components.togglebutton.root.focusRing.style',
  },
  {
    from: 'usages.togglebutton.focusRing.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.focusRing.offset',
    to: 'components.togglebutton.root.focusRing.offset',
  },
  {
    from: 'usages.togglebutton.focusRing.shadow',
    to: 'components.togglebutton.root.focusRing.shadow',
  },
  // Size variants - sm
  {
    from: 'usages.togglebutton.sm.font.size',
    to: 'components.togglebutton.root.sm.fontSize',
  },
  // Size variants - lg
  {
    from: 'usages.togglebutton.lg.font.size',
    to: 'components.togglebutton.root.lg.fontSize',
  },
  // Icon colors (default/unchecked)
  {
    from: 'usages.togglebutton.icon.color',
    to: 'components.togglebutton.colorScheme.{mode}.icon.color',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.icon.hover.color',
    to: 'components.togglebutton.colorScheme.{mode}.icon.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.icon.disabled.color',
    to: 'components.togglebutton.colorScheme.{mode}.icon.disabledColor',
    transform: toColorString,
  },
  // Icon colors (checked variant)
  {
    from: 'usages.togglebutton.icon.checked.color',
    to: 'components.togglebutton.colorScheme.{mode}.icon.checkedColor',
    transform: toColorString,
  },
  // Content sub-element
  {
    from: 'usages.togglebutton.content.border.radius',
    to: 'components.togglebutton.content.borderRadius',
  },
]
