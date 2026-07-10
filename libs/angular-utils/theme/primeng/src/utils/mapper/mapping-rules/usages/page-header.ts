import type { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const PAGE_HEADER_BREADCRUMB: MappingRule[] = [
	{
		from: 'usages.pageHeader.breadCrumbs.bg',
		to: 'components.breadcrumb.root.background',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.breadCrumbs.transition.duration',
		to: 'components.breadcrumb.root.transitionDuration',
	},
	{
		from: 'usages.pageHeader.breadCrumbs.breadcrumbItem.color',
		to: 'components.breadcrumb.item.color',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.breadCrumbs.breadcrumbItem.border.radius',
		to: 'components.breadcrumb.item.borderRadius',
	},
	{
		from: 'usages.pageHeader.breadCrumbs.breadcrumbItemStates.state.hover.defaultVariant.contrast',
		to: 'components.breadcrumb.item.hoverColor',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.breadCrumbs.focusRing.width',
		to: 'components.breadcrumb.item.focusRing.width',
	},
	{
		from: 'usages.pageHeader.breadCrumbs.focusRing.style',
		to: 'components.breadcrumb.item.focusRing.style',
	},
	{
		from: 'usages.pageHeader.breadCrumbs.focusRing.color',
		to: 'components.breadcrumb.item.focusRing.color',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.breadCrumbs.focusRing.offset',
		to: 'components.breadcrumb.item.focusRing.offset',
	},
	{
		from: 'usages.pageHeader.breadCrumbs.focusRing.shadow',
		to: 'components.breadcrumb.item.focusRing.shadow',
	},
	{
		from: 'usages.pageHeader.breadCrumbs.icon.color',
		to: 'components.breadcrumb.item.icon.color',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.breadCrumbs.seperator.color',
		to: 'components.breadcrumb.separator.color',
		transform: toColorString,
	},
]

const PAGE_HEADER_ACTION_BUTTON: MappingRule[] = [
	{
		from: 'usages.pageHeader.headerActions.button.color',
		to: 'components.button.primary.color',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.headerActions.button.bg',
		to: 'components.button.primary.background',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.headerActions.button.font.weight',
		to: 'components.button.root.label.fontWeight',
	},
	{
		from: 'usages.pageHeader.headerActions.button.font.size',
		to: 'components.button.root.lg.fontSize',
	},
	{
		from: 'usages.pageHeader.headerActions.buttonStates.defaultState.defaultVariant.border.defaultVariant.radius',
		to: 'components.button.root.borderRadius',
	},
	{
		from: 'usages.pageHeader.headerActions.buttonStates.defaultState.defaultVariant.border.defaultVariant.color',
		to: 'components.button.primary.borderColor',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.headerActions.buttonStates.state.hover.defaultVariant.bg',
		to: 'components.button.primary.hoverBackground',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.headerActions.buttonStates.state.hover.defaultVariant.contrast',
		to: 'components.button.primary.hoverColor',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.headerActions.buttonStates.state.hover.defaultVariant.border.defaultVariant.color',
		to: 'components.button.primary.hoverBorderColor',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.headerActions.buttonStates.state.active.defaultVariant.bg',
		to: 'components.button.primary.activeBackground',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.headerActions.buttonStates.state.active.defaultVariant.contrast',
		to: 'components.button.primary.activeColor',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.headerActions.buttonStates.state.active.defaultVariant.border.defaultVariant.color',
		to: 'components.button.primary.activeBorderColor',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.headerActions.buttonStates.state.focus.defaultVariant.focusRing.color',
		to: 'components.button.primary.focusRing.color',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.headerActions.buttonStates.state.focus.defaultVariant.focusRing.shadow',
		to: 'components.button.primary.focusRing.shadow',
	},
	{
		from: 'usages.pageHeader.focusRing.width',
		to: 'components.button.root.focusRing.width',
	},
	{
		from: 'usages.pageHeader.focusRing.style',
		to: 'components.button.root.focusRing.style',
	},
	{
		from: 'usages.pageHeader.focusRing.offset',
		to: 'components.button.root.focusRing.offset',
	},
]

const PAGE_HEADER_CONTEXT_MENU: MappingRule[] = [
	{
		from: 'usages.pageHeader.contextMenu.container.bg',
		to: 'components.menu.root.background',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.contextMenu.container.contrast',
		to: 'components.menu.root.color',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.contextMenu.container.border.color',
		to: 'components.menu.root.borderColor',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.contextMenu.container.border.radius',
		to: 'components.menu.root.borderRadius',
	},
	{
		from: 'usages.pageHeader.contextMenu.container.border.shadow',
		to: 'components.menu.root.shadow',
	},
	{
		from: 'usages.pageHeader.contextMenu.container.padding',
		to: 'components.menu.list.padding',
	},
	{
		from: 'usages.pageHeader.contextMenu.container.gap',
		to: 'components.menu.list.gap',
	},
	{
		from: 'usages.pageHeader.contextMenu.item.contrast',
		to: 'components.menu.item.color',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.contextMenu.item.padding',
		to: 'components.menu.item.padding',
	},
	{
		from: 'usages.pageHeader.contextMenu.item.border.radius',
		to: 'components.menu.item.borderRadius',
	},
	{
		from: 'usages.pageHeader.contextMenu.item.gap',
		to: 'components.menu.item.gap',
	},
	{
		from: 'usages.pageHeader.contextMenu.item.state.state.focus.defaultVariant.bg',
		to: 'components.menu.item.focusBackground',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.contextMenu.item.state.state.focus.defaultVariant.contrast',
		to: 'components.menu.item.focusColor',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.contextMenu.item.icon.color',
		to: 'components.menu.item.icon.color',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.contextMenu.item.state.state.focus.defaultVariant.contrast',
		to: 'components.menu.item.icon.focusColor',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.contextMenu.menuSeperator.color',
		to: 'components.menu.separator.borderColor',
		transform: toColorString,
	},
]

const PAGE_HEADER_CUSTOM_SEMANTIC: MappingRule[] = [
	{
		from: 'usages.pageHeader.header.text.title.family',
		to: 'semantic.extend.onecx.pageHeader.title.fontFamily',
	},
	{
		from: 'usages.pageHeader.header.text.title.size',
		to: 'semantic.extend.onecx.pageHeader.title.fontSize',
	},
	{
		from: 'usages.pageHeader.header.text.title.weight',
		to: 'semantic.extend.onecx.pageHeader.title.fontWeight',
	},
	{
		from: 'usages.pageHeader.header.text.subtitle.family',
		to: 'semantic.extend.onecx.pageHeader.subtitle.fontFamily',
	},
	{
		from: 'usages.pageHeader.header.text.subtitle.size',
		to: 'semantic.extend.onecx.pageHeader.subtitle.fontSize',
	},
	{
		from: 'usages.pageHeader.content.bg',
		to: 'semantic.extend.onecx.pageHeader.content.background',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.content.contrast',
		to: 'semantic.extend.onecx.pageHeader.content.color',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.content.padding',
		to: 'semantic.extend.onecx.pageHeader.content.padding',
	},
	{
		from: 'usages.pageHeader.content.contentLabel.size',
		to: 'semantic.extend.onecx.pageHeader.content.label.fontSize',
	},
	{
		from: 'usages.pageHeader.content.contentLabel.weight',
		to: 'semantic.extend.onecx.pageHeader.content.label.fontWeight',
	},
	{
		from: 'usages.pageHeader.content.contentLabel.color',
		to: 'semantic.extend.onecx.pageHeader.content.label.color',
		transform: toColorString,
	},
	{
		from: 'usages.pageHeader.content.contentValue.size',
		to: 'semantic.extend.onecx.pageHeader.content.value.fontSize',
	},
	{
		from: 'usages.pageHeader.content.contentValue.weight',
		to: 'semantic.extend.onecx.pageHeader.content.value.fontWeight',
	},
	{
		from: 'usages.pageHeader.content.contentValue.color',
		to: 'semantic.extend.onecx.pageHeader.content.value.color',
		transform: toColorString,
	},
]

export const pageHeaderMapping: MappingRule[] = [
	...PAGE_HEADER_BREADCRUMB,
	...PAGE_HEADER_ACTION_BUTTON,
	...PAGE_HEADER_CONTEXT_MENU,
	...PAGE_HEADER_CUSTOM_SEMANTIC,
]