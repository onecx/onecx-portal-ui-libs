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
]

const FIELDSET_LEGEND_BUTTON: MappingRule[] = [
  {
    from: 'usages.fieldset.legendButton.defaultState.background.color',
    to: 'components.fieldset.legend.background',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legendButton.defaultState.color',
    to: 'components.fieldset.legend.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legendButton.hover.color',
    to: 'components.fieldset.legend.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legendButton.defaultState.font.weight',
    to: 'components.fieldset.legend.fontWeight',
  },
  {
    from: 'usages.fieldset.legendButton.defaultState.focusRing.width',
    to: 'components.fieldset.legend.focusRing.width',
  },
  {
    from: 'usages.fieldset.legendButton.defaultState.focusRing.style',
    to: 'components.fieldset.legend.focusRing.style',
  },
  {
    from: 'usages.fieldset.legendButton.focus.focusRing.color',
    to: 'components.fieldset.legend.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legendButton.defaultState.focusRing.offset',
    to: 'components.fieldset.legend.focusRing.offset',
  }
]

const FIELDSET_TOGGLE_ICON: MappingRule[] = [
  {
    from: 'usages.fieldset.legendButton.defaultState.toggleIcon.color',
    to: 'components.fieldset.toggleIcon.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legendButton.hover.toggleIcon.color',
    to: 'components.fieldset.toggleIcon.hoverColor',
    transform: toColorString,
  },
]

export const fieldsetMappingRules: MappingRule[] = [
  ...FIELDSET_CONTAINER,
  ...FIELDSET_LEGEND_BUTTON,
  ...FIELDSET_TOGGLE_ICON,
]
