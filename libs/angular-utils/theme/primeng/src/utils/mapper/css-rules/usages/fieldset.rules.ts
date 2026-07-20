import type { CssRule } from '../../mapper.types'

const FIELDSET_TOGGLE_ICON: CssRule[] = [
    {
        selector: '.p-fieldset .p-fieldset-toggle-button .p-fieldset-toggle-icon',
        declarations: [
            {
                property: 'color',
                from: 'usages.fieldset.variant.withToggle.defaultState.legend.icon.color',
            },
            {
                property: 'background-color',
                from: 'usages.fieldset.variant.withToggle.defaultState.legend.icon.bg',
            },
            {
                property: 'width',
                from: 'usages.fieldset.variant.withToggle.defaultState.legend.icon.size',
            },
            {
                property: 'height',
                from: 'usages.fieldset.variant.withToggle.defaultState.legend.icon.size',
            },
        ],
    },
    {
        selector: '.p-fieldset .p-fieldset-toggle-button:hover .p-fieldset-toggle-icon',
        declarations: [
            {
                property: 'color',
                from: 'usages.fieldset.variant.withToggle.hover.legend.icon.color',
            },
            {
                property: 'background-color',
                from: 'usages.fieldset.variant.withToggle.hover.legend.icon.bg',
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
                from: 'usages.fieldset.defaultVariant.defaultState.defaultSeverity.container.contrast',
            },
        ],
    },
    {
        selector: '.p-fieldset .p-fieldset-toggle-button .p-fieldset-legend-label',
        declarations: [
            {
                property: 'color',
                from: 'usages.fieldset.variant.withToggle.defaultState.legend.color',
            },
        ],
    },
    {
        selector: '.p-fieldset .p-fieldset-toggle-button:hover .p-fieldset-legend-label',
        declarations: [
            {
                property: 'color',
                from: 'usages.fieldset.variant.withToggle.hover.legend.color',
            },
        ],
    },
]

export const fieldsetCssRules: CssRule[] = [...FIELDSET_LEGEND_LABEL, ...FIELDSET_TOGGLE_ICON]