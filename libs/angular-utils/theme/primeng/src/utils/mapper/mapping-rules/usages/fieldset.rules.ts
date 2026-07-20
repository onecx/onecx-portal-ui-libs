import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const FIELDSET_CONTAINER: MappingRule[] = [
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.container.bg',
    to: 'components.fieldset.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.container.border.color',
    to: 'components.fieldset.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.container.border.radius',
    to: 'components.fieldset.root.borderRadius',
  },
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.container.contrast',
    to: 'components.fieldset.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.container.padding.md',
    to: 'components.fieldset.root.padding',
  },
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.container.transition.duration',
    to: 'components.fieldset.root.transitionDuration',
  },
]

const FIELDSET_LEGEND: MappingRule[] = [
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.legend.bg',
    to: 'components.fieldset.legend.background',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.variant.withToggle.hover.legend.bg',
    to: 'components.fieldset.legend.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.legend.color',
    to: 'components.fieldset.legend.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.variant.withToggle.hover.legend.color',
    to: 'components.fieldset.legend.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.legend.border.radius',
    to: 'components.fieldset.legend.borderRadius',
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.legend.border.width',
    to: 'components.fieldset.legend.borderWidth',
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.legend.border.color',
    to: 'components.fieldset.legend.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.legend.padding',
    to: 'components.fieldset.legend.padding',
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.legend.gap.md',
    to: 'components.fieldset.legend.gap',
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.legend.font.weight',
    to: 'components.fieldset.legend.fontWeight',
  },
]

const FIELDSET_TOGGLE_ICON: MappingRule[] = [
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.legend.icon.color',
    to: 'components.fieldset.toggleIcon.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.variant.withToggle.hover.legend.icon.color',
    to: 'components.fieldset.toggleIcon.hoverColor',
    transform: toColorString,
  },
]

export const fieldsetMappingRules: MappingRule[] = [
  ...FIELDSET_CONTAINER,
  ...FIELDSET_LEGEND,
  ...FIELDSET_TOGGLE_ICON,
]
