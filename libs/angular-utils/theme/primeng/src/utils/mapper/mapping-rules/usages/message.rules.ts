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
    from: 'usages.message.close.icon.size',
    to: 'components.message.closeIcon.size',
  },
  {
    from: 'usages.message.size.sm.close.icon.size',
    to: 'components.message.closeIcon.sm.size',
  },
  {
    from: 'usages.message.size.lg.close.icon.size',
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
    from: 'usages.message.primary.outlined.default.info.color',
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
    from: 'usages.message.primary.filled.default.info.shadow.color',
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
    from: 'usages.message.size.sm.padding',
    to: 'components.message.content.sm.padding',
  },
  {
    from: 'usages.message.size.lg.padding',
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
    from: 'usages.message.size.sm.font.size',
    to: 'components.message.text.sm.fontSize',
  },
  {
    from: 'usages.message.size.lg.font.size',
    to: 'components.message.text.lg.fontSize',
  },
]

const icon: MappingRule[] = [
  {
    from: 'usages.message.icon.size',
    to: 'components.message.icon.size',
  },
  {
    from: 'usages.message.size.sm.icon.size',
    to: 'components.message.icon.sm.size',
  },
  {
    from: 'usages.message.size.lg.icon.size',
    to: 'components.message.icon.lg.size',
  },
]

const closeButton_info: MappingRule[] = [
  {
    from: 'usages.message.close.primary.filled.info.hover.backgroundColor',
    to: 'components.message.info.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.primary.filled.info.focus.focusRing.color',
    to: 'components.message.info.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.primary.filled.info.focus.focusRing.shadow',
    to: 'components.message.info.closeButton.focusRing.shadow',
  },
]

const closeButton_success: MappingRule[] = [
  {
    from: 'usages.message.close.primary.filled.success.hover.backgroundColor',
    to: 'components.message.success.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.primary.filled.success.focus.focusRing.color',
    to: 'components.message.success.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.primary.filled.success.focus.focusRing.shadow',
    to: 'components.message.success.closeButton.focusRing.shadow',
  },
]

const closeButton_warn: MappingRule[] = [
  {
    from: 'usages.message.close.primary.filled.warning.hover.backgroundColor',
    to: 'components.message.warn.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.primary.filled.warning.focus.focusRing.color',
    to: 'components.message.warn.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.primary.filled.warning.focus.focusRing.shadow',
    to: 'components.message.warn.closeButton.focusRing.shadow',
  },
]

const closeButton_error: MappingRule[] = [
  {
    from: 'usages.message.close.primary.filled.error.hover.backgroundColor',
    to: 'components.message.error.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.primary.filled.error.focus.focusRing.color',
    to: 'components.message.error.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.primary.filled.error.focus.focusRing.shadow',
    to: 'components.message.error.closeButton.focusRing.shadow',
  },
]

const closeButton_secondary: MappingRule[] = [
  {
    from: 'usages.message.close.secondary.filled.info.hover.backgroundColor',
    to: 'components.message.secondary.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.secondary.filled.info.focus.focusRing.color',
    to: 'components.message.secondary.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.secondary.filled.info.focus.focusRing.shadow',
    to: 'components.message.secondary.closeButton.focusRing.shadow',
  },
]

const closeButton_contrast: MappingRule[] = [
  {
    from: 'usages.message.close.secondary.filled.contrast.default.backgroundColor',
    to: 'components.message.contrast.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.secondary.filled.contrast.focus.focusRing.color',
    to: 'components.message.contrast.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.close.secondary.filled.contrast.focus.focusRing.shadow',
    to: 'components.message.contrast.closeButton.focusRing.shadow',
  },
]

const message_success_container: MappingRule[] = [
  {
    from: 'usages.message.primary.filled.default.success.backgroundColor',
    to: 'components.message.success.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.success.border.color',
    to: 'components.message.success.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.success.color',
    to: 'components.message.success.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.success.shadow.color',
    to: 'components.message.success.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.primary.outlined.default.success.color',
    to: 'components.message.success.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.outlined.default.success.border.color',
    to: 'components.message.success.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.primary.text.default.success.color',
    to: 'components.message.success.simple.color',
    transform: toColorString,
  },
]

const message_success: MappingRule[] = [...message_success_container, ...closeButton_success]
const message_warn_container: MappingRule[] = [
  {
    from: 'usages.message.primary.filled.default.warning.backgroundColor',
    to: 'components.message.warn.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.warning.border.color',
    to: 'components.message.warn.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.warning.color',
    to: 'components.message.warn.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.warning.shadow.color',
    to: 'components.message.warn.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.primary.outlined.default.warning.color',
    to: 'components.message.warn.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.outlined.default.warning.border.color',
    to: 'components.message.warn.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.primary.text.default.warning.color',
    to: 'components.message.warn.simple.color',
    transform: toColorString,
  },
]

const message_warn: MappingRule[] = [...message_warn_container, ...closeButton_warn]

const message_error_container: MappingRule[] = [
  {
    from: 'usages.message.primary.filled.default.error.backgroundColor',
    to: 'components.message.error.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.error.border.color',
    to: 'components.message.error.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.error.color',
    to: 'components.message.error.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.error.shadow.color',
    to: 'components.message.error.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.primary.outlined.default.error.color',
    to: 'components.message.error.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.outlined.default.error.border.color',
    to: 'components.message.error.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.primary.text.default.error.color',
    to: 'components.message.error.simple.color',
    transform: toColorString,
  },
]

const message_error: MappingRule[] = [...message_error_container, ...closeButton_error]

const message_info_container: MappingRule[] = [
  {
    from: 'usages.message.primary.filled.default.info.backgroundColor',
    to: 'components.message.info.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.info.border.color',
    to: 'components.message.info.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.info.color',
    to: 'components.message.info.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.outlined.default.info.border.color',
    to: 'components.message.info.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.primary.text.default.info.color',
    to: 'components.message.info.simple.color',
    transform: toColorString,
  },
]

const message_info: MappingRule[] = [...message_info_container, ...closeButton_info]

const message_secondary_container: MappingRule[] = [
  {
    from: 'usages.message.secondary.filled.default.info.backgroundColor',
    to: 'components.message.secondary.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.filled.default.info.border.color',
    to: 'components.message.secondary.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.filled.default.info.color',
    to: 'components.message.secondary.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.filled.default.info.shadow.color',
    to: 'components.message.secondary.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.secondary.outlined.default.info.color',
    to: 'components.message.secondary.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.outlined.default.info.border.color',
    to: 'components.message.secondary.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.secondary.text.default.info.color',
    to: 'components.message.secondary.simple.color',
    transform: toColorString,
  },
]

const message_secondary: MappingRule[] = [...message_secondary_container, ...closeButton_secondary]

const message_contrast_container: MappingRule[] = [
  {
    from: 'usages.message.primary.filled.default.contrast.backgroundColor',
    to: 'components.message.contrast.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.contrast.border.color',
    to: 'components.message.contrast.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.contrast.color',
    to: 'components.message.contrast.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.filled.default.contrast.shadow.color',
    to: 'components.message.contrast.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.primary.outlined.default.contrast.color',
    to: 'components.message.contrast.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.primary.outlined.default.contrast.border.color',
    to: 'components.message.contrast.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.primary.text.default.contrast.color',
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
