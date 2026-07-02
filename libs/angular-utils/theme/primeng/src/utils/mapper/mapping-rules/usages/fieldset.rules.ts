import { MappingRule } from '../../mapper.types'
import { toColorString } from '../../mapper.utils'

const FIELDSET_CONTAINER: MappingRule[] = [
  {
    from: 'usages.fieldset.container.bg',
    to: 'components.fieldset.root.background',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.container.border.color',
    to: 'components.fieldset.root.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.container.border.radius',
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

const FIELDSET_LEGEND_FOCUS_RING: MappingRule[] = [
  {
    from: 'usages.fieldset.legendFocusRing.width',
    to: 'components.fieldset.legend.focusRing.width',
  },
  {
    from: 'usages.fieldset.legendFocusRing.style',
    to: 'components.fieldset.legend.focusRing.style',
  },
  {
    from: 'usages.fieldset.legendFocusRing.color',
    to: 'components.fieldset.legend.focusRing.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legendFocusRing.offset',
    to: 'components.fieldset.legend.focusRing.offset',
  },
  {
    from: 'usages.fieldset.legendFocusRing.shadow',
    to: 'components.fieldset.legend.focusRing.shadow',
  },
]

const FIELDSET_LEGEND: MappingRule[] = [
  {
    from: 'usages.fieldset.legend.bg',
    to: 'components.fieldset.legend.background',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legendHover.bg.color',
    to: 'components.fieldset.legend.hoverBackground',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.contrast',
    to: 'components.fieldset.legend.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legendHover.contrast',
    to: 'components.fieldset.legend.hoverColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.border.radius',
    to: 'components.fieldset.legend.borderRadius',
  },
  {
    from: 'usages.fieldset.legend.border.width',
    to: 'components.fieldset.legend.borderWidth',
  },
  {
    from: 'usages.fieldset.legend.border.color',
    to: 'components.fieldset.legend.borderColor',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.legend.padding',
    to: 'components.fieldset.legend.padding',
  },
  {
    from: 'usages.fieldset.legend.layout.gap',
    to: 'components.fieldset.legend.gap',
  },
  {
    from: 'usages.fieldset.legend.font.weight',
    to: 'components.fieldset.legend.fontWeight',
  },
  ...FIELDSET_LEGEND_FOCUS_RING,
]

const FIELDSET_TOGGLE_ICON: MappingRule[] = [
  {
    from: 'usages.fieldset.toggleIcon.contrast',
    to: 'components.fieldset.toggleIcon.color',
    transform: toColorString,
  },
  {
    from: 'usages.fieldset.toggleIconHover.contrast',
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
  ...FIELDSET_LEGEND_FOCUS_RING,
  ...FIELDSET_TOGGLE_ICON,
  ...FIELDSET_CONTENT,
]
