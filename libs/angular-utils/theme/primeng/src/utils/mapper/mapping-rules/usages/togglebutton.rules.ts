import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

export const togglebuttonMappingRules: MappingRule[] = [
  // Structural root tokens
  { from: 'usages.togglebutton.padding', to: 'components.togglebutton.root.padding' },
  { from: 'usages.togglebutton.gap', to: 'components.togglebutton.root.gap' },
  { from: 'usages.togglebutton.font.weight', to: 'components.togglebutton.root.fontWeight' },
  {
    from: 'usages.togglebutton.defaultVariant.defaultState.border.radius',
    to: 'components.togglebutton.root.borderRadius',
  },
  { from: 'usages.togglebutton.transitionDuration', to: 'components.togglebutton.root.transitionDuration' },

  { from: 'usages.togglebutton.focusRing.width', to: 'components.togglebutton.root.focusRing.width' },
  { from: 'usages.togglebutton.focusRing.style', to: 'components.togglebutton.root.focusRing.style' },
  { from: 'usages.togglebutton.focusRing.offset', to: 'components.togglebutton.root.focusRing.offset' },
  { from: 'usages.togglebutton.focusRing.shadow', to: 'components.togglebutton.root.focusRing.shadow' },
  {
    from: 'usages.togglebutton.focusRing.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.focusRing.color',
    transform: toColorString,
  },

  // Size variants (structural)
  { from: 'usages.togglebutton.sm.font.size', to: 'components.togglebutton.root.sm.fontSize' },
  { from: 'usages.togglebutton.sm.padding', to: 'components.togglebutton.root.sm.padding' },
  { from: 'usages.togglebutton.lg.font.size', to: 'components.togglebutton.root.lg.fontSize' },
  { from: 'usages.togglebutton.lg.padding', to: 'components.togglebutton.root.lg.padding' },

  // Root colors — default (unchecked)
  {
    from: 'usages.togglebutton.defaultVariant.defaultState.background',
    to: 'components.togglebutton.colorScheme.{mode}.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.defaultVariant.defaultState.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.defaultVariant.defaultState.border.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.borderColor',
    transform: toColorString,
  },

  // Root colors — hover (unchecked only; PrimeNG suppresses hover once checked)
  {
    from: 'usages.togglebutton.defaultVariant.hover.background',
    to: 'components.togglebutton.colorScheme.{mode}.root.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.defaultVariant.hover.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.hoverColor',
    transform: toColorString,
  },

  // Root colors — checked
  {
    from: 'usages.togglebutton.defaultVariant.selected.background',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.defaultVariant.selected.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.defaultVariant.selected.border.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.checkedBorderColor',
    transform: toColorString,
  },

  // Root colors — disabled (single PrimeNG rule shared by checked/unchecked)
  {
    from: 'usages.togglebutton.defaultVariant.disabled.background',
    to: 'components.togglebutton.colorScheme.{mode}.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.defaultVariant.disabled.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.disabledColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.defaultVariant.disabled.border.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.disabledBorderColor',
    transform: toColorString,
  },

  // Root colors — invalid (single PrimeNG rule shared by checked/unchecked)
  {
    from: 'usages.togglebutton.defaultVariant.invalid.border.color',
    to: 'components.togglebutton.colorScheme.{mode}.root.invalidBorderColor',
    transform: toColorString,
  },

  // Icon colors 
  {
    from: 'usages.togglebutton.defaultVariant.defaultState.icon.color',
    to: 'components.togglebutton.colorScheme.{mode}.icon.color',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.defaultVariant.hover.icon.color',
    to: 'components.togglebutton.colorScheme.{mode}.icon.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.defaultVariant.selected.icon.color',
    to: 'components.togglebutton.colorScheme.{mode}.icon.checkedColor',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.defaultVariant.disabled.icon.color',
    to: 'components.togglebutton.colorScheme.{mode}.icon.disabledColor',
    transform: toColorString,
  },

  // Content sub-element (also lives inside each owning state)
  {
    from: 'usages.togglebutton.defaultVariant.defaultState.content.padding',
    to: 'components.togglebutton.content.padding',
  },
  {
    from: 'usages.togglebutton.defaultVariant.defaultState.content.border.radius',
    to: 'components.togglebutton.content.borderRadius',
  },
  { from: 'usages.togglebutton.sm.content.padding', to: 'components.togglebutton.content.sm.padding' },
  { from: 'usages.togglebutton.lg.content.padding', to: 'components.togglebutton.content.lg.padding' },
  {
    from: 'usages.togglebutton.defaultVariant.selected.content.background',
    to: 'components.togglebutton.colorScheme.{mode}.content.checkedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.togglebutton.defaultVariant.selected.content.shadow',
    to: 'components.togglebutton.colorScheme.{mode}.content.checkedShadow',
  },
]
