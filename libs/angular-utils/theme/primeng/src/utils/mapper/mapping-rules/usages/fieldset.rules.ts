import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const FIELDSET_CONTAINER: MappingRule[] = [
  {
    from: 'usages.fieldset.backgroundColor',
    to: 'components.fieldset.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.border.color',
    to: 'components.fieldset.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.border.radius',
    to: 'components.fieldset.root.borderRadius',
  },
  {
    from: 'usages.fieldset.color',
    to: 'components.fieldset.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.padding',
    to: 'components.fieldset.root.padding',
  },
]

const FIELDSET_LEGEND: MappingRule[] = [
  {
    from: 'usages.fieldset.legend.color',
    to: 'components.fieldset.legend.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.hover.color',
    to: 'components.fieldset.legend.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.padding',
    to: 'components.fieldset.legend.padding',
  },
  {
    from: 'usages.fieldset.legend.font.weight',
    to: 'components.fieldset.legend.fontWeight',
  },
  {
    from: 'usages.fieldset.legend.focusRing.width',
    to: 'components.fieldset.legend.focusRing.width',
  },
  {
    from: 'usages.fieldset.legend.focusRing.style',
    to: 'components.fieldset.legend.focusRing.style',
  },
  {
    from: 'usages.fieldset.legend.focus.color',
    to: 'components.fieldset.legend.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.focusRing.offset',
    to: 'components.fieldset.legend.focusRing.offset',
  },
  {
    from: 'usages.fieldset.legend.focusRing.shadow',
    to: 'components.fieldset.legend.focusRing.shadow',
  },
]

const FIELDSET_TOGGLE_ICON: MappingRule[] = [
  {
    from: 'usages.fieldset.legend.toggleIcon.color',
    to: 'components.fieldset.toggleIcon.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.toggleIcon.hover.color',
    to: 'components.fieldset.toggleIcon.hoverColor',
    transform: toColorString,
  },
]

const FIELDSET_CONTENT: MappingRule[] = [
  {
    from: 'usages.fieldset.padding',
    to: 'components.fieldset.content.padding',
  },
]

export const fieldsetMappingRules: MappingRule[] = [
  ...FIELDSET_CONTAINER,
  ...FIELDSET_LEGEND,
  ...FIELDSET_CONTENT,
  ...FIELDSET_TOGGLE_ICON,
]
