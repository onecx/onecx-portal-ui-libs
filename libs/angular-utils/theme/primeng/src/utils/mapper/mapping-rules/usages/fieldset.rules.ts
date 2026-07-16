import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const FIELDSET_CONTAINER: MappingRule[] = [
  {
    from: 'usages.fieldset.container.bg',
    to: 'components.fieldset.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.container.borderColor',
    to: 'components.fieldset.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.container.borderRadius',
    to: 'components.fieldset.root.borderRadius',
  },
  {
    from: 'usages.fieldset.container.contrast',
    to: 'components.fieldset.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.container.padding',
    to: 'components.fieldset.root.padding',
  },
  {
    from: 'usages.fieldset.container.transition.duration',
    to: 'components.fieldset.root.transitionDuration',
  },
]

const FIELDSET_LEGEND: MappingRule[] = [
  {
    from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.bg',
    to: 'components.fieldset.legend.background',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.states.hover.bg',
    to: 'components.fieldset.legend.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.contrast',
    to: 'components.fieldset.legend.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.states.hover.contrast',
    to: 'components.fieldset.legend.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.border.radius',
    to: 'components.fieldset.legend.borderRadius',
  },
  {
    from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.border.width',
    to: 'components.fieldset.legend.borderWidth',
  },
  {
    from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.border.color',
    to: 'components.fieldset.legend.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.padding',
    to: 'components.fieldset.legend.padding',
  },
  {
    from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.gap',
    to: 'components.fieldset.legend.gap',
  },
  {
    from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.font.weight',
    to: 'components.fieldset.legend.fontWeight',
  },
]

const FIELDSET_TOGGLE_ICON: MappingRule[] = [
  {
    from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.icon.defaultState.color',
    to: 'components.fieldset.toggleIcon.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.icon.hover.color',
    to: 'components.fieldset.toggleIcon.hoverColor',
    transform: toColorString,
  },
]

export const fieldsetMappingRules: MappingRule[] = [
  ...FIELDSET_CONTAINER,
  ...FIELDSET_LEGEND,
  ...FIELDSET_TOGGLE_ICON,
]
