import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const DROPDOWN_ROOT: MappingRule[] = [
	{
		from: 'usages.dropdown.container.states.disable.bg',
		to: 'components.select.root.disabledBackground',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.container.bg',
		to: 'components.select.root.filledBackground',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.container.states.hover.bg',
		to: 'components.select.root.filledHoverBackground',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.container.states.focus.bg',
		to: 'components.select.root.filledFocusBackground',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.container.border.color',
		to: 'components.select.root.borderColor',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.container.states.hover.border.color',
		to: 'components.select.root.hoverBorderColor',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.container.states.focus.border.color',
		to: 'components.select.root.focusBorderColor',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.container.states.disable.border.color',
		to: 'components.select.root.invalidBorderColor',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.container.contrast',
		to: 'components.select.root.color',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.container.states.disable.contrast',
		to: 'components.select.root.disabledColor',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.container.placeholder.contrast',
		to: 'components.select.root.placeholderColor',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.container.invalidPlaceholder.contrast',
		to: 'components.select.root.invalidPlaceholderColor',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.container.border.shadow',
		to: 'components.select.root.shadow',
	},
	{
		from: 'usages.dropdown.container.space.md',
		to: 'components.select.root.paddingX',
	},
	{
		from: 'usages.dropdown.container.space.md',
		to: 'components.select.root.paddingY',
	},
	{
		from: 'usages.dropdown.container.border.radius',
		to: 'components.select.root.borderRadius',
	},
	{
		from: 'usages.dropdown.container.focusRing.width',
		to: 'components.select.root.focusRing.width',
	},
	{
		from: 'usages.dropdown.container.focusRing.style',
		to: 'components.select.root.focusRing.style',
	},
	{
		from: 'usages.dropdown.container.focusRing.color',
		to: 'components.select.root.focusRing.color',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.container.focusRing.offset',
		to: 'components.select.root.focusRing.offset',
	},
	{
		from: 'usages.dropdown.container.focusRing.shadow',
		to: 'components.select.root.focusRing.shadow',
	},
	{
		from: 'usages.dropdown.container.transition.duration',
		to: 'components.select.root.transitionDuration',
	},
	{
		from: 'usages.dropdown.container.font.size',
		to: 'components.select.root.sm.fontSize',
	},
	{
		from: 'usages.dropdown.container.space.sm',
		to: 'components.select.root.sm.paddingX',
	},
	{
		from: 'usages.dropdown.container.space.sm',
		to: 'components.select.root.sm.paddingY',
	},
	{
		from: 'usages.dropdown.container.font.size',
		to: 'components.select.root.lg.fontSize',
	},
	{
		from: 'usages.dropdown.container.space.lg',
		to: 'components.select.root.lg.paddingX',
	},
	{
		from: 'usages.dropdown.container.space.lg',
		to: 'components.select.root.lg.paddingY',
	},
	{
		from: 'usages.dropdown.container.font.weight',
		to: 'components.select.root.fontWeight' as any,
	},
	{
		from: 'usages.dropdown.container.font.size',
		to: 'components.select.root.fontSize' as any,
	},
	{
		from: 'usages.dropdown.container.width',
		to: 'components.select.dropdown.width',
	},
	{
		from: 'usages.dropdown.container.contrast',
		to: 'components.select.dropdown.color',
		transform: toColorString,
	},
]

const DROPDOWN_OVERLAY: MappingRule[] = [
	{
		from: 'usages.dropdown.overlay.bg',
		to: 'components.select.overlay.background',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.overlay.border.color',
		to: 'components.select.overlay.borderColor',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.overlay.border.radius',
		to: 'components.select.overlay.borderRadius',
	},
	{
		from: 'usages.dropdown.overlay.contrast',
		to: 'components.select.overlay.color',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.overlay.border.shadow',
		to: 'components.select.overlay.shadow',
	},
]

const DROPDOWN_LIST: MappingRule[] = [
	{
		from: 'usages.dropdown.list.space.md',
		to: 'components.select.list.padding',
	},
	{
		from: 'usages.dropdown.list.space.sm',
		to: 'components.select.list.gap',
	},
	{
		from: 'usages.dropdown.list.space.sm',
		to: 'components.select.list.header.padding',
	},
]

const DROPDOWN_OPTION: MappingRule[] = [
	{
		from: 'usages.dropdown.option.focus.bg',
		to: 'components.select.option.focusBackground',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.option.selected.bg',
		to: 'components.select.option.selectedBackground',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.option.selected.focus.bg',
		to: 'components.select.option.selectedFocusBackground',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.option.color',
		to: 'components.select.option.color',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.option.focus.contrast',
		to: 'components.select.option.focusColor',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.option.selected.contrast',
		to: 'components.select.option.selectedColor',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.option.selected.focus.contrast',
		to: 'components.select.option.selectedFocusColor',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.option.padding',
		to: 'components.select.option.padding',
	},
	{
		from: 'usages.dropdown.option.group.bg',
		to: 'components.select.optionGroup.background',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.option.group.contrast',
		to: 'components.select.optionGroup.color',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.option.group.padding',
		to: 'components.select.optionGroup.padding',
	},
]

const DROPDOWN_MISC: MappingRule[] = [
	{
		from: 'usages.dropdown.clear.icon.color',
		to: 'components.select.clearIcon.color',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.checkmark.color',
		to: 'components.select.checkmark.color',
		transform: toColorString,
	},
	{
		from: 'usages.dropdown.checkmark.gutter.start',
		to: 'components.select.checkmark.gutterStart',
	},
	{
		from: 'usages.dropdown.checkmark.gutter.end',
		to: 'components.select.checkmark.gutterEnd',
	},
	{
		from: 'usages.dropdown.empty.message.padding',
		to: 'components.select.emptyMessage.padding',
	},
]

export const dropdownMappingRules: MappingRule[] = [
	...DROPDOWN_ROOT,
	...DROPDOWN_OVERLAY,
	...DROPDOWN_LIST,
	...DROPDOWN_OPTION,
	...DROPDOWN_MISC,
]