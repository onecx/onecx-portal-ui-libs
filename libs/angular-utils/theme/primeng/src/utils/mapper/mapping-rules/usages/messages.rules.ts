import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const MESSAGE_ROOT: MappingRule[] = [
	{
		from: 'usages.message.container.variants.defaultVariant.border.defaultVariant.radius',
		to: 'components.message.root.borderRadius',
	},
	{
		from: 'usages.message.container.variants.defaultVariant.border.defaultVariant.width',
		to: 'components.message.root.borderWidth',
	},
	{
		from: 'usages.message.container.transition.duration',
		to: 'components.message.root.transitionDuration',
	},
	{
		from: 'usages.message.container.variants.defaultVariant.border.defaultVariant.width',
		to: 'components.message.outlined.root.borderWidth',
	},
]

const MESSAGE_CONTENT: MappingRule[] = [
	{
		from: 'usages.message.container.padding',
		to: 'components.message.content.padding',
	},
	{
		from: 'usages.message.container.gap',
		to: 'components.message.content.gap',
	},
	{
		from: 'usages.message.container.padding',
		to: 'components.message.content.sm.padding',
	},
	{
		from: 'usages.message.container.padding',
		to: 'components.message.content.lg.padding',
	},
	{
		from: 'usages.message.container.padding',
		to: 'components.message.simple.content.padding',
	},
]

const MESSAGE_TEXT: MappingRule[] = [
	{
		from: 'usages.message.container.font.size',
		to: 'components.message.text.fontSize',
	},
	{
		from: 'usages.message.container.font.weight',
		to: 'components.message.text.fontWeight',
	},
	{
		from: 'usages.message.container.font.size',
		to: 'components.message.text.sm.fontSize',
	},
	{
		from: 'usages.message.container.font.size',
		to: 'components.message.text.lg.fontSize',
	},
]

const MESSAGE_ICONS: MappingRule[] = [
	{
		from: 'usages.message.container.messageIcon.size',
		to: 'components.message.icon.size',
	},
	{
		from: 'usages.message.container.messageIcon.size',
		to: 'components.message.icon.sm.size',
	},
	{
		from: 'usages.message.container.messageIcon.size',
		to: 'components.message.icon.lg.size',
	},
	{
		from: 'usages.message.container.closeButton.states.default.icon.size',
		to: 'components.message.closeIcon.size',
	},
	{
		from: 'usages.message.container.closeButton.states.default.icon.size',
		to: 'components.message.closeIcon.sm.size',
	},
	{
		from: 'usages.message.container.closeButton.states.default.icon.size',
		to: 'components.message.closeIcon.lg.size',
	},
]

const MESSAGE_CLOSE_BUTTON: MappingRule[] = [
	{
		from: 'usages.message.container.closeButton.states.default.border.width',
		to: 'components.message.closeButton.width',
	},
	{
		from: 'usages.message.container.closeButton.states.default.border.width',
		to: 'components.message.closeButton.height',
	},
	{
		from: 'usages.message.container.closeButton.states.default.border.radius',
		to: 'components.message.closeButton.borderRadius',
	},
	{
		from: 'usages.message.container.closeButton.states.focus.focusRing.width',
		to: 'components.message.closeButton.focusRing.width',
	},
	{
		from: 'usages.message.container.closeButton.states.focus.focusRing.style',
		to: 'components.message.closeButton.focusRing.style',
	},
	{
		from: 'usages.message.container.closeButton.states.focus.focusRing.offset',
		to: 'components.message.closeButton.focusRing.offset',
	},
]

const severityRules = (
	sourceSeverity: 'info' | 'success' | 'warning' | 'danger' | 'contrast',
	targetSeverity: 'info' | 'success' | 'warn' | 'error' | 'secondary' | 'contrast'
): MappingRule[] => [
	{
		from: `usages.message.container.variants.variant.${sourceSeverity}.bg`,
		to: `components.message.${targetSeverity}.background`,
		transform: toColorString,
	},
	{
		from: `usages.message.container.variants.variant.${sourceSeverity}.border.defaultVariant.color`,
		to: `components.message.${targetSeverity}.borderColor`,
		transform: toColorString,
	},
	{
		from: `usages.message.container.variants.variant.${sourceSeverity}.contrast`,
		to: `components.message.${targetSeverity}.color`,
		transform: toColorString,
	},
	{
		from: `usages.message.container.variants.variant.${sourceSeverity}.focusRing.shadow`,
		to: `components.message.${targetSeverity}.shadow`,
	},
	{
		from: 'usages.message.container.closeButton.states.hover.bg',
		to: `components.message.${targetSeverity}.closeButton.hoverBackground`,
		transform: toColorString,
	},
	{
		from: 'usages.message.container.closeButton.states.focus.focusRing.color',
		to: `components.message.${targetSeverity}.closeButton.focusRing.color`,
		transform: toColorString,
	},
	{
		from: 'usages.message.container.closeButton.states.focus.focusRing.shadow',
		to: `components.message.${targetSeverity}.closeButton.focusRing.shadow`,
	},
	{
		from: `usages.message.container.variants.variant.${sourceSeverity}.contrast`,
		to: `components.message.${targetSeverity}.outlined.color`,
		transform: toColorString,
	},
	{
		from: `usages.message.container.variants.variant.${sourceSeverity}.border.defaultVariant.color`,
		to: `components.message.${targetSeverity}.outlined.borderColor`,
		transform: toColorString,
	},
	{
		from: `usages.message.container.variants.variant.${sourceSeverity}.contrast`,
		to: `components.message.${targetSeverity}.simple.color`,
		transform: toColorString,
	},
]

const MESSAGE_SEVERITY: MappingRule[] = [
	...severityRules('info', 'info'),
	...severityRules('success', 'success'),
	...severityRules('warning', 'warn'),
	...severityRules('danger', 'error'),
	...severityRules('contrast', 'contrast'),
	...severityRules('contrast', 'secondary'),
]

export const messageMappingRules: MappingRule[] = [
	...MESSAGE_ROOT,
	...MESSAGE_CONTENT,
	...MESSAGE_TEXT,
	...MESSAGE_ICONS,
	...MESSAGE_CLOSE_BUTTON,
	...MESSAGE_SEVERITY,
]