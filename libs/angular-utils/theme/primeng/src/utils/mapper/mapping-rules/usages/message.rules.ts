import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const closeButton_default: MappingRule[] = [
  {
    from: 'usages.message.close.button.width',
    to: 'components.message.closeButton.width',
  },
  {
    from: 'usages.message.close.button.height',
    to: 'components.message.closeButton.height',
  },
  {
    from: 'usages.message.close.button.border.radius',
    to: 'components.message.closeButton.borderRadius',
  },
  {
    from: 'usages.message.close.button.focus.focusRing.width',
    to: 'components.message.closeButton.focusRing.width',
  },
  {
    from: 'usages.message.close.button.focus.focusRing.style',
    to: 'components.message.closeButton.focusRing.style',
  },
  {
    from: 'usages.message.close.button.focus.focusRing.offset',
    to: 'components.message.closeButton.focusRing.offset',
  },
  // close icon
  {
    from: 'usages.message.close.button.icon.size',
    to: 'components.message.closeIcon.size',
  },
  {
    from: 'usages.message.close.button.icon.sm.size',
    to: 'components.message.closeIcon.sm.size',
  },
  {
    from: 'usages.message.close.button.icon.lg.size',
    to: 'components.message.closeIcon.lg.size',
  },
]

const outlined: MappingRule[] = [
  {
    from: 'usages.message.outlined.border.width',
    to: 'components.message.outlined.root.borderWidth',
  },
  // -- info outlined --
  {
    from: 'usages.message.info.outlined.color',
    to: 'components.message.info.outlined.color',
    transform: toColorString,
  },
]

const root: MappingRule[] = [
  {
    from: 'usages.message.root.border.radius',
    to: 'components.message.root.borderRadius',
  },
  {
    from: 'usages.message.root.border.width',
    to: 'components.message.root.borderWidth',
  },
  {
    from: 'usages.message.root.transition.duration',
    to: 'components.message.root.transitionDuration',
  },
  ...closeButton_default,
  ...outlined,

  // simple
  {
    from: 'usages.message.simple.content.padding',
    to: 'components.message.simple.content.padding',
  },

  //------ info ------
  {
    from: 'usages.message.info.border.shadow',
    to: 'components.message.info.shadow',
  },
]

const content: MappingRule[] = [
  {
    from: 'usages.message.content.padding',
    to: 'components.message.content.padding',
  },
  {
    from: 'usages.message.content.gap',
    to: 'components.message.content.gap',
  },
  {
    from: 'usages.message.content.sm.padding',
    to: 'components.message.content.sm.padding',
  },
  {
    from: 'usages.message.content.lg.padding',
    to: 'components.message.content.lg.padding',
  },
]

const text: MappingRule[] = [
  {
    from: 'usages.message.text.font.size',
    to: 'components.message.text.fontSize',
  },
  {
    from: 'usages.message.text.font.weight',
    to: 'components.message.text.fontWeight',
  },
  {
    from: 'usages.message.text.sm.font.size',
    to: 'components.message.text.sm.fontSize',
  },
  {
    from: 'usages.message.text.lg.font.size',
    to: 'components.message.text.lg.fontSize',
  },
]

const icon: MappingRule[] = [
  {
    from: 'usages.message.icon.size',
    to: 'components.message.icon.size',
  },
  {
    from: 'usages.message.icon.sm.size',
    to: 'components.message.icon.sm.size',
  },
  {
    from: 'usages.message.icon.lg.size',
    to: 'components.message.icon.lg.size',
  },
]

const closeButton_info: MappingRule[] = [
  {
    from: 'usages.message.info.close.button.hover.background.color',
    to: 'components.message.info.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.info.close.button.focus.focusRing.color',
    to: 'components.message.info.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.info.close.button.focus.focusRing.shadow',
    to: 'components.message.info.closeButton.focusRing.shadow',
  },
]

const closeButton_success: MappingRule[] = [
  {
    from: 'usages.message.success.close.button.hover.background.color',
    to: 'components.message.success.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.success.close.button.focus.focusRing.color',
    to: 'components.message.success.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.success.close.button.focus.focusRing.shadow',
    to: 'components.message.success.closeButton.focusRing.shadow',
  },
]

const closeButton_warn: MappingRule[] = [
  {
    from: 'usages.message.warning.close.button.hover.background.color',
    to: 'components.message.warn.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.warning.close.button.focus.focusRing.color',
    to: 'components.message.warn.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.warning.close.button.focus.focusRing.shadow',
    to: 'components.message.warn.closeButton.focusRing.shadow',
  },
]

const closeButton_error: MappingRule[] = [
  {
    from: 'usages.message.error.close.button.hover.background.color',
    to: 'components.message.error.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.error.close.button.focus.focusRing.color',
    to: 'components.message.error.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.error.close.button.focus.focusRing.shadow',
    to: 'components.message.error.closeButton.focusRing.shadow',
  },
]

const closeButton_secondary: MappingRule[] = [
  {
    from: 'usages.message.secondary.close.button.hover.background.color',
    to: 'components.message.secondary.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.close.button.focus.focusRing.color',
    to: 'components.message.secondary.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.close.button.focus.focusRing.shadow',
    to: 'components.message.secondary.closeButton.focusRing.shadow',
  },
]

const closeButton_contrast: MappingRule[] = [
  {
    from: 'usages.message.contrast.close.button.hover.background.color',
    to: 'components.message.contrast.closeButton.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.message.contrast.close.button.focus.focusRing.color',
    to: 'components.message.contrast.closeButton.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.contrast.close.button.focus.focusRing.shadow',
    to: 'components.message.contrast.closeButton.focusRing.shadow',
  },
]

const message_success_container: MappingRule[] = [
  {
    from: 'usages.message.success.background.color',
    to: 'components.message.success.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.success.border.color',
    to: 'components.message.success.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.success.color',
    to: 'components.message.success.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.success.border.shadow',
    to: 'components.message.success.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.success.outlined.color',
    to: 'components.message.success.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.success.outlined.border.color',
    to: 'components.message.success.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.success.simple.color',
    to: 'components.message.success.simple.color',
    transform: toColorString,
  },
]

const message_success: MappingRule[] = [...message_success_container, ...closeButton_success]
const message_warn_container: MappingRule[] = [
  {
    from: 'usages.message.warning.background.color',
    to: 'components.message.warn.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.warning.border.color',
    to: 'components.message.warn.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.warning.color',
    to: 'components.message.warn.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.warning.border.shadow',
    to: 'components.message.warn.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.warning.outlined.color',
    to: 'components.message.warn.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.warning.outlined.border.color',
    to: 'components.message.warn.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.warning.simple.color',
    to: 'components.message.warn.simple.color',
    transform: toColorString,
  },
]

const message_warn: MappingRule[] = [...message_warn_container, ...closeButton_warn]

const message_error_container: MappingRule[] = [
  {
    from: 'usages.message.error.background.color',
    to: 'components.message.error.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.error.border.color',
    to: 'components.message.error.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.error.color',
    to: 'components.message.error.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.error.border.shadow',
    to: 'components.message.error.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.error.outlined.color',
    to: 'components.message.error.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.error.outlined.border.color',
    to: 'components.message.error.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.error.simple.color',
    to: 'components.message.error.simple.color',
    transform: toColorString,
  },
]

const message_error: MappingRule[] = [...message_error_container, ...closeButton_error]

const message_info_container: MappingRule[] = [
  {
    from: 'usages.message.info.background.color',
    to: 'components.message.info.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.info.border.color',
    to: 'components.message.info.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.info.color',
    to: 'components.message.info.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.info.outlined.border.color',
    to: 'components.message.info.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.info.simple.color',
    to: 'components.message.info.simple.color',
    transform: toColorString,
  },
]

const message_info: MappingRule[] = [...message_info_container, ...closeButton_info]

const message_secondary_container: MappingRule[] = [
  {
    from: 'usages.message.secondary.background.color',
    to: 'components.message.secondary.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.border.color',
    to: 'components.message.secondary.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.color',
    to: 'components.message.secondary.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.border.shadow',
    to: 'components.message.secondary.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.secondary.outlined.color',
    to: 'components.message.secondary.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.secondary.outlined.border.color',
    to: 'components.message.secondary.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.secondary.simple.color',
    to: 'components.message.secondary.simple.color',
    transform: toColorString,
  },
]

const message_secondary: MappingRule[] = [...message_secondary_container, ...closeButton_secondary]

const message_contrast_container: MappingRule[] = [
  {
    from: 'usages.message.contrast.background.color',
    to: 'components.message.contrast.background',
    transform: toColorString,
  },
  {
    from: 'usages.message.contrast.border.color',
    to: 'components.message.contrast.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.message.contrast.color',
    to: 'components.message.contrast.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.contrast.border.shadow',
    to: 'components.message.contrast.shadow',
  },
  // -- outlined --
  {
    from: 'usages.message.contrast.outlined.color',
    to: 'components.message.contrast.outlined.color',
    transform: toColorString,
  },
  {
    from: 'usages.message.contrast.outlined.border.color',
    to: 'components.message.contrast.outlined.borderColor',
    transform: toColorString,
  },

  // -- simple --
  {
    from: 'usages.message.contrast.simple.color',
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
