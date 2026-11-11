import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const panel: MappingRule[] = [
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.border.width',
    to: 'components.accordion.panel.borderWidth',
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.border.color',
    to: 'components.accordion.panel.borderColor',
    transform: toColorString,
  },
]

const header: MappingRule[] = [
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.color',
    to: 'components.accordion.header.color',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.hover.color',
    to: 'components.accordion.header.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.active.header.defaultVariant.defaultState.color',
    to: 'components.accordion.header.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.active.header.defaultVariant.hover.color',
    to: 'components.accordion.header.activeHoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.padding',
    to: 'components.accordion.header.padding',
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.font.weight',
    to: 'components.accordion.header.fontWeight',
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.border.radius',
    to: 'components.accordion.header.borderRadius',
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.border.width',
    to: 'components.accordion.header.borderWidth',
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.border.color',
    to: 'components.accordion.header.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.background.color',
    to: 'components.accordion.header.background',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.hover.background.color',
    to: 'components.accordion.header.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.active.header.defaultVariant.defaultState.background.color',
    to: 'components.accordion.header.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.active.header.defaultVariant.hover.background.color',
    to: 'components.accordion.header.activeHoverBackground',
    transform: toColorString,
  },
]

const headerFocusRing: MappingRule[] = [
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.focusRing.width',
    to: 'components.accordion.header.focusRing.width',
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.focusRing.style',
    to: 'components.accordion.header.focusRing.style',
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.focusRing.color',
    to: 'components.accordion.header.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.focusRing.offset',
    to: 'components.accordion.header.focusRing.offset',
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.focusRing.shadow',
    to: 'components.accordion.header.focusRing.shadow',
  },
]

const toggleIcon: MappingRule[] = [
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.toggleIcon.color',
    to: 'components.accordion.header.toggleIcon.color',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.hover.toggleIcon.color',
    to: 'components.accordion.header.toggleIcon.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.active.header.defaultVariant.defaultState.toggleIcon.color',
    to: 'components.accordion.header.toggleIcon.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.active.header.defaultVariant.hover.toggleIcon.color',
    to: 'components.accordion.header.toggleIcon.activeHoverColor',
    transform: toColorString,
  },
]

const firstLast: MappingRule[] = [
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.first.border.width',
    to: 'components.accordion.header.first.borderWidth',
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.first.border.radius',
    to: 'components.accordion.header.first.topBorderRadius',
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.last.border.radius',
    to: 'components.accordion.header.last.bottomBorderRadius',
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.active.header.defaultVariant.defaultState.last.border.radius',
    to: 'components.accordion.header.last.activeBottomBorderRadius',
  },
]

const content: MappingRule[] = [
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.content.border.width',
    to: 'components.accordion.content.borderWidth',
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.content.border.color',
    to: 'components.accordion.content.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.content.background.color',
    to: 'components.accordion.content.background',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.content.color',
    to: 'components.accordion.content.color',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.defaultVariant.panel.defaultVariant.defaultState.content.padding',
    to: 'components.accordion.content.padding',
  },
]

export const accordionMappingRules: MappingRule[] = [
  ...panel,
  ...header,
  ...headerFocusRing,
  ...toggleIcon,
  ...firstLast,
  ...content,
]
