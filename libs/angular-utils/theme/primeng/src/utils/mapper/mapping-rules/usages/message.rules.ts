import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const closeButton_default: MappingRule[] = [
  {
    from: 'usages.message.close.width',
    to: 'components.message.closeButton.width',
  },
  {
    from: 'usages.message.close.height',
    to: 'components.message.closeButton.height',
  },
  {
    from: 'usages.message.close.border.radius',
    to: 'components.message.closeButton.borderRadius',
  },
  {
    from: 'usages.message.close.focusRing.width',
    to: 'components.message.closeButton.focusRing.width',
  },
  {
    from: 'usages.message.close.focusRing.style',
    to: 'components.message.closeButton.focusRing.style',
  },
  {
    from: 'usages.message.close.focusRing.offset',
    to: 'components.message.closeButton.focusRing.offset',
  },
  //close icon
  {
    from: 'usages.message.md.close.icon.size',
    to: 'components.message.closeIcon.size',
  },
  {
    from: 'usages.message.sm.close.icon.size',
    to: 'components.message.closeIcon.sm.size',
  },
  {
    from: 'usages.message.lg.close.icon.size',
    to: 'components.message.closeIcon.lg.size',
  },
]

const outlined: MappingRule[] = [
  {
    from: 'usages.message.close.border.width',
    to: 'components.message.outlined.root.borderWidth',
  },
  // -- info outlined --
  {
    from: 'usages.message.primary.outline.info.color',
    to: 'components.message.info.outlined.color',
    transform: toColorString,
  },
]

const root: MappingRule[] = [
  {
    from: 'usages.message.border.radius',
    to: 'components.message.root.borderRadius',
  },
  {
    from: 'usages.message.border.width',
    to: 'components.message.root.borderWidth',
  },
  {
    from: 'usages.message.transition.duration',
    to: 'components.message.root.transitionDuration',
  },
  ...closeButton_default,
  ...outlined,

  //----- simple ----
  {
    from: 'usages.message.padding',
    to: 'components.message.simple.content.padding',
  },

  //------ info ------
  {
    from: 'usages.message.primary.filled.info.shadowColor',
    to: 'components.message.info.shadow',
  },
]

const content: MappingRule[] = [
  {
    from: 'usages.message.padding',
    to: 'components.message.content.padding',
  },
  {
    from: 'usages.message.gap',
    to: 'components.message.content.gap',
  },
  {
    from: 'usages.message.sm.padding',
    to: 'components.message.content.sm.padding',
  },
  {
    from: 'usages.message.lg.padding',
    to: 'components.message.content.lg.padding',
  },
]

const text: MappingRule[] = [
  {
    from: 'usages.message.font.size',
    to: 'components.message.text.fontSize',
  },
  {
    from: 'usages.message.font.weight',
    to: 'components.message.text.fontWeight',
  },
  {
    from: 'usages.message.sm.font.size',
    to: 'components.message.text.sm.fontSize',
  },
  {
    from: 'usages.message.lg.font.size',
    to: 'components.message.text.lg.fontSize',
  },
]

const icon: MappingRule[] = [
  {
    from: 'usages.message.icon.size',
    to: 'components.message.icon.size',
  },
  {
    from: 'usages.message.sm.icon.size',
    to: 'components.message.icon.sm.size',
  },
  {
    from: 'usages.message.lg.icon.size',
    to: 'components.message.icon.lg.size',
  },
]

const closeButton_info: MappingRule[] = [
  {
    from: 'usages.message.close.primary.filled.hover.info.backgroundColor',
    to: 'components.message.info.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.primary.filled.info.focusRing.color',
    to: 'components.message.info.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.focusRing.shadow',
    to: 'components.message.info.closeButton.focusRing.shadow',
  },
]

const closeButton_success: MappingRule[] = [
  {
    from: 'usages.message.close.primary.filled.hover.success.backgroundColor',
    to: 'components.message.success.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.primary.filled.success.focusRing.color',
    to: 'components.message.success.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.focusRing.shadow',
    to: 'components.message.success.closeButton.focusRing.shadow',
  },
]

const closeButton_warn: MappingRule[] = [
  {
    from: 'usages.message.close.primary.filled.hover.warning.backgroundColor',
    to: 'components.message.warn.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.primary.filled.warning.focusRing.color',
    to: 'components.message.warn.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.focusRing.shadow',
    to: 'components.message.warn.closeButton.focusRing.shadow',
  },
]

const closeButton_error: MappingRule[] = [
  {
    from: 'usages.message.close.primary.filled.hover.error.backgroundColor',
    to: 'components.message.error.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.primary.filled.error.focusRing.color',
    to: 'components.message.error.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.focusRing.shadow',
    to: 'components.message.error.closeButton.focusRing.shadow',
  },
]

const closeButton_secondary: MappingRule[] = [
  {
    from: 'usages.message.close.secondary.filled.hover.info.backgroundColor',
    to: 'components.message.secondary.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.secondary.filled.info.focusRing.color',
    to: 'components.message.secondary.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.focusRing.shadow',
    to: 'components.message.secondary.closeButton.focusRing.shadow',
  },
]

const closeButton_contrast: MappingRule[] = [
  {
    from: 'usages.message.close.secondary.filled.hover.contrast.backgroundColor',
    to: 'components.message.contrast.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.secondary.filled.contrast.focusRing.color',
    to: 'components.message.contrast.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.focusRing.shadow',
    to: 'components.message.contrast.closeButton.focusRing.shadow',
  },
]

const message_success_container: MappingRule[] = [
  {
    from: 'usages.message.primary.filled.success.backgroundColor',
    to: 'components.message.success.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.success.border.color',
    to: 'components.message.success.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.success.color',
    to: 'components.message.success.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.success.shadowColor',
    to: 'components.message.success.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.primary.outline.success.color',
    to: 'components.message.success.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.outline.success.border.color',
    to: 'components.message.success.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.primary.text.success.color',
    to: 'components.message.success.simple.color',
    transform: toColorString,
  },
]

const message_success: MappingRule[] = [...message_success_container, ...closeButton_success]
const message_warn_container: MappingRule[] = [
  {
    from: 'usages.message.primary.filled.warning.backgroundColor',
    to: 'components.message.warn.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.warning.border.color',
    to: 'components.message.warn.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.warning.color',
    to: 'components.message.warn.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.warning.shadowColor',
    to: 'components.message.warn.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.primary.outline.warning.color',
    to: 'components.message.warn.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.outline.warning.border.color',
    to: 'components.message.warn.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.primary.text.warning.color',
    to: 'components.message.warn.simple.color',
    transform: toColorString,
  },
]

const message_warn: MappingRule[] = [...message_warn_container, ...closeButton_warn]

const message_error_container: MappingRule[] = [
  {
    from: 'usages.message.primary.filled.error.backgroundColor',
    to: 'components.message.error.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.error.border.color',
    to: 'components.message.error.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.error.color',
    to: 'components.message.error.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.error.shadowColor',
    to: 'components.message.error.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.primary.outline.error.color',
    to: 'components.message.error.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.outline.error.border.color',
    to: 'components.message.error.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.primary.text.error.color',
    to: 'components.message.error.simple.color',
    transform: toColorString,
  },
]

const message_error: MappingRule[] = [...message_error_container, ...closeButton_error]

const message_info_container: MappingRule[] = [
  {
    from: 'usages.message.primary.filled.info.backgroundColor',
    to: 'components.message.info.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.info.border.color',
    to: 'components.message.info.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.info.color',
    to: 'components.message.info.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.outline.info.border.color',
    to: 'components.message.info.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.primary.text.info.color',
    to: 'components.message.info.simple.color',
    transform: toColorString,
  },
]

const message_info: MappingRule[] = [...message_info_container, ...closeButton_info]

const message_secondary_container: MappingRule[] = [
  {
    from: 'usages.message.secondary.filled.info.backgroundColor',
    to: 'components.message.secondary.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.filled.info.border.color',
    to: 'components.message.secondary.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.filled.info.color',
    to: 'components.message.secondary.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.filled.info.shadowColor',
    to: 'components.message.secondary.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.secondary.outline.info.color',
    to: 'components.message.secondary.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.outline.info.border.color',
    to: 'components.message.secondary.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.secondary.text.info.color',
    to: 'components.message.secondary.simple.color',
    transform: toColorString,
  },
]

const message_secondary: MappingRule[] = [...message_secondary_container, ...closeButton_secondary]

const message_contrast_container: MappingRule[] = [
  {
    from: 'usages.message.primary.filled.contrast.backgroundColor',
    to: 'components.message.contrast.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.contrast.border.color',
    to: 'components.message.contrast.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.contrast.color',
    to: 'components.message.contrast.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.contrast.shadowColor',
    to: 'components.message.contrast.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.primary.outline.contrast.color',
    to: 'components.message.contrast.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.outline.contrast.border.color',
    to: 'components.message.contrast.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.primary.text.contrast.color',
    to: 'components.message.contrast.simple.color',
    transform: toColorString,
  },
]

const message_contrast: MappingRule[] = [...message_contrast_container, ...closeButton_contrast]

const closeButton: MappingRule[] = [
  ...message_success,
  ...message_warn,
  ...message_info,
  ...message_error,
  ...message_secondary,
  ...message_contrast,
]

export const messageMappingRules: MappingRule[] = [...root, ...content, ...text, ...icon, ...closeButton]
