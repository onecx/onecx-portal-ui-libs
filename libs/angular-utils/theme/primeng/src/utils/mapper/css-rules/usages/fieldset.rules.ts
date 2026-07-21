import type { CssRule } from '../../mapper.types'

const FIELDSET_TOGGLE_ICON: CssRule[] = [
  {
    selector: '.p-fieldset .p-fieldset-toggle-button .p-fieldset-toggle-icon',
    declarations: [
      {
        property: 'color',
        from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.defaultState.defaultSeverity.icon.color',
      },
      {
        property: 'width',
        from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.defaultState.defaultSeverity.icon.size',
      },
      {
        property: 'height',
        from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.defaultState.defaultSeverity.icon.size',
      },
    ],
  },
  {
    selector: '.p-fieldset .p-fieldset-toggle-button:hover .p-fieldset-toggle-icon',
    declarations: [
      {
        property: 'color',
        from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.state.hover.defaultSeverity.color',
      },
    ],
  },
]

const FIELDSET_LEGEND_LABEL: CssRule[] = [
  {
    selector: '.p-fieldset .p-fieldset-legend .p-fieldset-legend-label',
    declarations: [
      {
        property: 'color',
        from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.legend.defaultVariant.defaultState.defaultSeverity.color',
      },
    ],
  },
  {
    selector: '.p-fieldset .p-fieldset-toggle-button .p-fieldset-legend-label',
    declarations: [
      {
        property: 'color',
        from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.defaultState.defaultSeverity.color',
      },
    ],
  },
  {
    selector: '.p-fieldset .p-fieldset-toggle-button:hover .p-fieldset-legend-label',
    declarations: [
      {
        property: 'color',
        from: 'usages.fieldset.variant.withToggle.defaultState.defaultSeverity.legend.defaultVariant.state.hover.defaultSeverity.color',
      },
    ],
  },
]

export const fieldsetCssRules: CssRule[] = [...FIELDSET_LEGEND_LABEL, ...FIELDSET_TOGGLE_ICON]
