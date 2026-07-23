import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const MESSAGE_CONTENT: MappingRule[] = [
  {
    from: 'usages.message.defaultVariant.defaultState.severity.info.sizeVariants.defaultSize.padding',
    to: 'components.message.content.padding',
  },
  {
    from: 'usages.message.defaultVariant.defaultState.severity.info.sizeVariants.defaultSize.gap',
    to: 'components.message.content.gap',
  },
  {
    from: 'usages.message.defaultVariant.defaultState.severity.info.sizeVariants.size.sm.padding',
    to: 'components.message.content.sm.padding',
  },
  {
    from: 'usages.message.defaultVariant.defaultState.severity.info.sizeVariants.size.lg.padding',
    to: 'components.message.content.lg.padding',
  },
]

const MESSAGE_TEXT: MappingRule[] = [
  {
    from: 'usages.message.defaultVariant.defaultState.severity.info.font.size',
    to: 'components.message.text.fontSize',
  },
  {
    from: 'usages.message.defaultVariant.defaultState.severity.info.font.weight',
    to: 'components.message.text.fontWeight',
  },
  {
    from: 'usages.message.defaultVariant.defaultState.severity.info.sizeVariants.size.sm.font.size',
    to: 'components.message.text.sm.fontSize',
  },
  {
    from: 'usages.message.defaultVariant.defaultState.severity.info.sizeVariants.size.lg.font.size',
    to: 'components.message.text.lg.fontSize',
  },
]

const MESSAGE_ICONS: MappingRule[] = [
  {
    from: 'usages.message.defaultVariant.defaultState.severity.info.sizeVariants.defaultSize.iconSize',
    to: 'components.message.icon.size',
  },
  {
    from: 'usages.message.defaultVariant.defaultState.severity.info.sizeVariants.size.sm.iconSize',
    to: 'components.message.icon.sm.size',
  },
  {
    from: 'usages.message.defaultVariant.defaultState.severity.info.sizeVariants.size.lg.iconSize',
    to: 'components.message.icon.lg.size',
  },
]

const MESSAGE_VARIANTS: MappingRule[] = [
  {
    from: 'usages.message.defaultVariant.defaultState.severity.info.sizeVariants.defaultSize.padding',
    to: 'components.message.simple.content.padding',
  },
  {
    from: 'usages.message.variants.withOutline.defaultState.severity.info.border.width',
    to: 'components.message.outlined.root.borderWidth',
  },
]

const severityRules = (
  sourceSeverity: 'info' | 'success' | 'warn' | 'danger' | 'error' | 'contrast' | 'secondary',
  targetSeverity: 'info' | 'success' | 'warn' | 'error' | 'contrast' | 'secondary'
): MappingRule[] => [
  // Filled Variant
  {
    from: `usages.message.defaultVariant.defaultState.severity.${sourceSeverity}.bg`,
    to: `components.message.${targetSeverity}.background`,
    transform: toColorString,
  },
  {
    from: `usages.message.defaultVariant.defaultState.severity.${sourceSeverity}.borderColor`,
    to: `components.message.${targetSeverity}.borderColor`,
    transform: toColorString,
  },
  {
    from: `usages.message.defaultVariant.defaultState.severity.${sourceSeverity}.contrast`,
    to: `components.message.${targetSeverity}.color`,
    transform: toColorString,
  },

  // Outlined Variant
  {
    from: `usages.message.variants.withOutline.defaultState.severity.${sourceSeverity}.contrast`,
    to: `components.message.${targetSeverity}.outlined.color`,
    transform: toColorString,
  },
  {
    from: `usages.message.variants.withOutline.defaultState.severity.${sourceSeverity}.borderColor`,
    to: `components.message.${targetSeverity}.outlined.borderColor`,
    transform: toColorString,
  },

  // Simple/Text Variant
  {
    from: `usages.message.variants.withText.defaultState.severity.${sourceSeverity}.contrast`,
    to: `components.message.${targetSeverity}.simple.color`,
    transform: toColorString,
  },

  // Close Button Focus Ring
  {
    from: `usages.message.defaultVariant.defaultState.severity.${sourceSeverity}.closeButton.state.focus.focusRing.color`,
    to: `components.message.${targetSeverity}.closeButton.focusRing.color`,
    transform: toColorString,
  },
  {
    from: `usages.message.defaultVariant.defaultState.severity.${sourceSeverity}.closeButton.state.focus.focusRing.shadow`,
    to: `components.message.${targetSeverity}.closeButton.focusRing.shadow`,
  },

  // Close Button Hover
  {
    from: `usages.message.defaultVariant.defaultState.severity.${sourceSeverity}.closeButton.state.hover.severity.${sourceSeverity}.bg`,
    to: `components.message.${targetSeverity}.closeButton.hoverBackground`,
    transform: toColorString,
  },
]

const MESSAGE_SEVERITY: MappingRule[] = [
  ...severityRules('info', 'info'),
  ...severityRules('success', 'success'),
  ...severityRules('warn', 'warn'),
  ...severityRules('danger', 'error'),
  ...severityRules('error', 'error'),
  ...severityRules('contrast', 'contrast'),
  ...severityRules('secondary', 'secondary'),
]

export const messageMappingRules: MappingRule[] = [
  ...MESSAGE_CONTENT,
  ...MESSAGE_TEXT,
  ...MESSAGE_ICONS,
  ...MESSAGE_VARIANTS,
  ...MESSAGE_SEVERITY,
]
