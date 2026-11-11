import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

// Not every PrimeNG `multiselect.*` design token has a matching schema leaf (e.g. `root.shadow`,
// `root.focusRing.*`, `root.transitionDuration`, `dropdown.width` and the entire checkbox/filter
// subtree have no source in the current schema — see `../../../../../../integration-interface/
// .../schema/multiselect/*`). Those tokens are intentionally omitted here rather than mapped
// from an unrelated leaf.

const MULTISELECT_ROOT: MappingRule[] = [
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.defaultState.background',
    to: 'components.multiselect.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.disabled.background',
    to: 'components.multiselect.root.disabledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.filled.labelContainer.defaultState.background',
    to: 'components.multiselect.root.filledBackground',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.filled.labelContainer.hover.background',
    to: 'components.multiselect.root.filledHoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.filled.labelContainer.focus.background',
    to: 'components.multiselect.root.filledFocusBackground',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.defaultState.border.color',
    to: 'components.multiselect.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.hover.border.color',
    to: 'components.multiselect.root.hoverBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.focus.border.color',
    to: 'components.multiselect.root.focusBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.invalid.border.color',
    to: 'components.multiselect.root.invalidBorderColor',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.defaultState.color',
    to: 'components.multiselect.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.disabled.color',
    to: 'components.multiselect.root.disabledColor',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.defaultState.placeholderColor',
    to: 'components.multiselect.root.placeholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.invalid.placeholderColor',
    to: 'components.multiselect.root.invalidPlaceholderColor',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.defaultState.border.radius',
    to: 'components.multiselect.root.borderRadius',
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.defaultState.sm.font.size',
    to: 'components.multiselect.root.sm.fontSize',
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.defaultState.sm.padding',
    to: 'components.multiselect.root.sm.paddingX',
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.defaultState.sm.padding',
    to: 'components.multiselect.root.sm.paddingY',
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.defaultState.lg.font.size',
    to: 'components.multiselect.root.lg.fontSize',
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.defaultState.lg.padding',
    to: 'components.multiselect.root.lg.paddingX',
  },
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.defaultState.lg.padding',
    to: 'components.multiselect.root.lg.paddingY',
  },
]

const MULTISELECT_DROPDOWN: MappingRule[] = [
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.defaultState.dropdownIcon.color',
    to: 'components.multiselect.dropdown.color',
    transform: toColorString,
  },
]

const MULTISELECT_OVERLAY: MappingRule[] = [
  {
    from: 'usages.multiselect.defaultVariant.overlay.background',
    to: 'components.multiselect.overlay.background',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.border.color',
    to: 'components.multiselect.overlay.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.border.radius',
    to: 'components.multiselect.overlay.borderRadius',
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.color',
    to: 'components.multiselect.overlay.color',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.border.shadow',
    to: 'components.multiselect.overlay.shadow',
  },
]

const MULTISELECT_LIST: MappingRule[] = [
  {
    from: 'usages.multiselect.defaultVariant.overlay.listItems.paddingY',
    to: 'components.multiselect.list.padding',
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.listItems.gap',
    to: 'components.multiselect.list.gap',
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.filter.paddingY',
    to: 'components.multiselect.list.header.padding',
  },
]

const MULTISELECT_OPTION: MappingRule[] = [
  {
    from: 'usages.multiselect.defaultVariant.overlay.listItems.item.focus.background',
    to: 'components.multiselect.option.focusBackground',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.listItems.item.selected.background',
    to: 'components.multiselect.option.selectedBackground',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.listItems.item.selected.background',
    to: 'components.multiselect.option.selectedFocusBackground',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.listItems.item.defaultState.paddingY',
    to: 'components.multiselect.option.padding',
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.listItems.item.defaultState.border.radius',
    to: 'components.multiselect.option.borderRadius',
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.listItems.item.defaultState.gap',
    to: 'components.multiselect.option.gap',
  },
]

const MULTISELECT_OPTION_GROUP: MappingRule[] = [
  {
    from: 'usages.multiselect.defaultVariant.overlay.listItems.groupHeader.background',
    to: 'components.multiselect.optionGroup.background',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.listItems.groupHeader.color',
    to: 'components.multiselect.optionGroup.color',
    transform: toColorString,
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.listItems.groupHeader.font.weight',
    to: 'components.multiselect.optionGroup.fontWeight',
  },
  {
    from: 'usages.multiselect.defaultVariant.overlay.listItems.groupHeader.paddingY',
    to: 'components.multiselect.optionGroup.padding',
  },
]

const MULTISELECT_CLEAR_ICON: MappingRule[] = [
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.defaultState.clearIcon.color',
    to: 'components.multiselect.clearIcon.color',
    transform: toColorString,
  },
]

const MULTISELECT_CHIP: MappingRule[] = [
  {
    from: 'usages.multiselect.defaultVariant.labelContainer.chip.defaultState.border.radius',
    to: 'components.multiselect.chip.borderRadius',
  },
]

const MULTISELECT_EMPTY_MESSAGE: MappingRule[] = [
  {
    from: 'usages.multiselect.defaultVariant.overlay.listItems.emptyMessage.paddingY',
    to: 'components.multiselect.emptyMessage.padding',
  },
]

export const multiselectMappingRules: MappingRule[] = [
  ...MULTISELECT_ROOT,
  ...MULTISELECT_DROPDOWN,
  ...MULTISELECT_OVERLAY,
  ...MULTISELECT_LIST,
  ...MULTISELECT_OPTION,
  ...MULTISELECT_OPTION_GROUP,
  ...MULTISELECT_CLEAR_ICON,
  ...MULTISELECT_CHIP,
  ...MULTISELECT_EMPTY_MESSAGE,
]
