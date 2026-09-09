import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const panel: MappingRule[] = [
  {
    from: 'usages.accordion.panel.border.width',
    to: 'components.accordion.panel.borderWidth',
  },
  {
    from: 'usages.accordion.panel.border.color',
    to: 'components.accordion.panel.borderColor',
    transform: toColorString,
  },
]

const header: MappingRule[] = [
  {
    from: 'usages.accordion.header.color',
    to: 'components.accordion.header.color',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.header.hover.color',
    to: 'components.accordion.header.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.header.active.color',
    to: 'components.accordion.header.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.header.active.hover.color',
    to: 'components.accordion.header.activeHoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.header.padding',
    to: 'components.accordion.header.padding',
  },
  {
    from: 'usages.accordion.header.font.weight',
    to: 'components.accordion.header.fontWeight',
  },
  {
    from: 'usages.accordion.header.border.radius',
    to: 'components.accordion.header.borderRadius',
  },
  {
    from: 'usages.accordion.header.border.width',
    to: 'components.accordion.header.borderWidth',
  },
  {
    from: 'usages.accordion.header.border.color',
    to: 'components.accordion.header.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.header.background.color',
    to: 'components.accordion.header.background',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.header.hover.background.color',
    to: 'components.accordion.header.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.header.active.background.color',
    to: 'components.accordion.header.activeBackground',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.header.active.hover.background.color',
    to: 'components.accordion.header.activeHoverBackground',
    transform: toColorString,
  },
]

const headerFocusRing: MappingRule[] = [
  {
    from: 'usages.accordion.header.focusRing.width',
    to: 'components.accordion.header.focusRing.width',
  },
  {
    from: 'usages.accordion.header.focusRing.style',
    to: 'components.accordion.header.focusRing.style',
  },
  {
    from: 'usages.accordion.header.focusRing.color',
    to: 'components.accordion.header.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.header.focusRing.offset',
    to: 'components.accordion.header.focusRing.offset',
  },
  {
    from: 'usages.accordion.header.focusRing.shadow',
    to: 'components.accordion.header.focusRing.shadow',
  },
]

const toggleIcon: MappingRule[] = [
  {
    from: 'usages.accordion.header.toggleIcon.color',
    to: 'components.accordion.header.toggleIcon.color',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.header.toggleIcon.hover.color',
    to: 'components.accordion.header.toggleIcon.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.header.toggleIcon.active.color',
    to: 'components.accordion.header.toggleIcon.activeColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.header.toggleIcon.active.hover.color',
    to: 'components.accordion.header.toggleIcon.activeHoverColor',
    transform: toColorString,
  },
]

const firstLast: MappingRule[] = [
  {
    from: 'usages.accordion.header.first.border.width',
    to: 'components.accordion.header.first.borderWidth',
  },
  {
    from: 'usages.accordion.header.first.border.radius',
    to: 'components.accordion.header.first.topBorderRadius',
  },
  {
    from: 'usages.accordion.header.last.border.radius',
    to: 'components.accordion.header.last.bottomBorderRadius',
  },
  {
    from: 'usages.accordion.header.last.border.radius',
    to: 'components.accordion.header.last.activeBottomBorderRadius',
  },
]

const content: MappingRule[] = [
  {
    from: 'usages.accordion.content.border.width',
    to: 'components.accordion.content.borderWidth',
  },
  {
    from: 'usages.accordion.content.border.color',
    to: 'components.accordion.content.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.content.background.color',
    to: 'components.accordion.content.background',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.content.color',
    to: 'components.accordion.content.color',
    transform: toColorString,
  },
  {
    from: 'usages.accordion.content.padding',
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
