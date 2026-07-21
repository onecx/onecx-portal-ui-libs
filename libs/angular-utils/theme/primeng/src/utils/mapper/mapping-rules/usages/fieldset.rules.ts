import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const FIELDSET_CONTAINER: MappingRule[] = [
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.container.defaultVariant.defaultState.defaultSeverity.bg',
    to: 'components.fieldset.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.container.defaultVariant.defaultState.defaultSeverity.border.color',
    to: 'components.fieldset.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.container.defaultVariant.defaultState.defaultSeverity.border.radius',
    to: 'components.fieldset.root.borderRadius',
  },
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.container.defaultVariant.defaultState.defaultSeverity.contrast',
    to: 'components.fieldset.root.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.container.defaultVariant.defaultState.defaultSeverity.padding',
    to: 'components.fieldset.root.padding',
  },
]

const FIELDSET_LEGEND: MappingRule[] = [
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.legend.defaultVariant.defaultState.defaultSeverity.color',
    to: 'components.fieldset.legend.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.state.hover.defaultSeverity.color',
    to: 'components.fieldset.legend.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.legend.defaultVariant.defaultState.defaultSeverity.padding',
    to: 'components.fieldset.legend.padding',
  },
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.legend.defaultVariant.defaultState.defaultSeverity.font.weight',
    to: 'components.fieldset.legend.fontWeight',
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.state.focus.defaultSeverity.focusRing.width',
    to: 'components.fieldset.legend.focusRing.width',
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.state.focus.defaultSeverity.focusRing.style',
    to: 'components.fieldset.legend.focusRing.style',
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.state.focus.defaultSeverity.focusRing.color',
    to: 'components.fieldset.legend.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.state.focus.defaultSeverity.focusRing.offset',
    to: 'components.fieldset.legend.focusRing.offset',
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.state.focus.defaultSeverity.focusRing.shadow',
    to: 'components.fieldset.legend.focusRing.shadow',
  },
]

const FIELDSET_TOGGLE_ICON: MappingRule[] = [
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.defaultState.defaultSeverity.icon.color',
    to: 'components.fieldset.toggleIcon.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.state.hover.defaultSeverity.color',
    to: 'components.fieldset.toggleIcon.hoverColor',
    transform: toColorString,
  },
]

const FIELDSET_CONTENT: MappingRule[] = [
  {
    from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.content.defaultVariant.defaultState.defaultSeverity.padding',
    to: 'components.fieldset.content.padding',
  },
]

export const fieldsetMappingRules: MappingRule[] = [
  ...FIELDSET_CONTAINER,
  ...FIELDSET_LEGEND,
  ...FIELDSET_CONTENT,
  ...FIELDSET_TOGGLE_ICON,
]
