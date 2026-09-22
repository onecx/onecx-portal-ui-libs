import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const FIELDSET_CONTAINER: MappingRule[] = [
  {
    from: 'usages.fieldset.defaultVariant.background.color',
    to: 'components.fieldset.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.defaultVariant.border.color',
    to: 'components.fieldset.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.defaultVariant.border.radius',
    to: 'components.fieldset.root.borderRadius',
  },
  {
    from: 'usages.fieldset.defaultVariant.color',
    to: 'components.fieldset.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.defaultVariant.padding',
    to: 'components.fieldset.root.padding',
  },
]

const FIELDSET_LEGEND: MappingRule[] = [
  {
    from: 'usages.fieldset.legend.defaultState.background.color',
    to: 'components.fieldset.legend.background',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.defaultState.color',
    to: 'components.fieldset.legend.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.hover.color',
    to: 'components.fieldset.legend.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.defaultState.padding',
    to: 'components.fieldset.legend.padding',
  },
  {
    from: 'usages.fieldset.legend.defaultState.font.weight',
    to: 'components.fieldset.legend.fontWeight',
  },
  {
    from: 'usages.fieldset.legend.defaultState.focusRing.width',
    to: 'components.fieldset.legend.focusRing.width',
  },
  {
    from: 'usages.fieldset.legend.defaultState.focusRing.style',
    to: 'components.fieldset.legend.focusRing.style',
  },
  {
    from: 'usages.fieldset.legend.focus.focusRing.color',
    to: 'components.fieldset.legend.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.defaultState.focusRing.offset',
    to: 'components.fieldset.legend.focusRing.offset',
  }
]

const FIELDSET_TOGGLE_ICON: MappingRule[] = [
  {
    from: 'usages.fieldset.legend.defaultState.toggleIcon.color',
    to: 'components.fieldset.toggleIcon.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.hover.toggleIcon.color',
    to: 'components.fieldset.toggleIcon.hoverColor',
    transform: toColorString,
  },
]

const FIELDSET_CONTENT: MappingRule[] = [
  {
    from: 'usages.fieldset.content.padding',
    to: 'components.fieldset.content.padding',
  },
]

export const fieldsetMappingRules: MappingRule[] = [
  ...FIELDSET_CONTAINER,
  ...FIELDSET_LEGEND,
  ...FIELDSET_CONTENT,
  ...FIELDSET_TOGGLE_ICON,
]
