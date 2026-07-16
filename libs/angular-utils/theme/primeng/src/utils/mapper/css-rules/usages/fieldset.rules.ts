import type { CssRule } from '../../mapper.types'

const FIELDSET_TOGGLE_ICON: CssRule[] = [
    {
        selector: '.p-fieldset .p-fieldset-toggle-button .p-fieldset-toggle-icon',
        declarations: [
            {
                property: 'color',
                from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.icon.defaultState.color',
            },
            {
                property: 'background-color',
                from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.icon.defaultState.bg',
            },
            {
                property: 'width',
                from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.icon.size',
            },
            {
                property: 'height',
                from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.icon.size',
            },
        ],
    },
    {
        selector: '.p-fieldset .p-fieldset-toggle-button:hover .p-fieldset-toggle-icon',
        declarations: [
            {
                property: 'color',
                from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.icon.hover.color',
            },
            {
                property: 'background-color',
                from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.icon.hover.bg',
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
                from: 'usages.fieldset.legend.withoutToggle.contrast',
            },
        ],
    },
    {
        selector: '.p-fieldset .p-fieldset-toggle-button .p-fieldset-legend-label',
        declarations: [
            {
                property: 'color',
                from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.contrast',
            },
        ],
    },
    {
        selector: '.p-fieldset .p-fieldset-toggle-button:hover .p-fieldset-legend-label',
        declarations: [
            {
                property: 'color',
                from: 'usages.fieldset.legend.withToggle.defaultStateWithToggle.states.hover.contrast',
            },
        ],
    },
]

export const fieldsetCssRules: CssRule[] = [...FIELDSET_LEGEND_LABEL, ...FIELDSET_TOGGLE_ICON]