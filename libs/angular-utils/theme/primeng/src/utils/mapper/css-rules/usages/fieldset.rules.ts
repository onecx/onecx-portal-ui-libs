import type { CssRule } from '../../mapper.types'

const FIELDSET_TOGGLE_ICON: CssRule[] = [
  {
    selector: '.p-fieldset .p-fieldset-toggle-button .p-fieldset-toggle-icon',
    declarations: [
      {
        property: 'color',
        from: 'usages.fieldset.legend.toggleIcon.color',
      },
      {
        property: 'width',
        from: 'usages.fieldset.legend.toggleIcon.width',
      },
      {
        property: 'height',
        from: 'usages.fieldset.legend.toggleIcon.height',
      },
    ],
  },
  {
    selector: '.p-fieldset .p-fieldset-toggle-button:hover .p-fieldset-toggle-icon',
    declarations: [
      {
        property: 'color',
        from: 'usages.fieldset.legend.toggleIcon.hover.color',
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
        from: 'usages.fieldset.legend.color', // when legend is text only
      },
    ],
  },
  {
    selector: '.p-fieldset .p-fieldset-toggle-button .p-fieldset-legend-label',
    declarations: [
      {
        property: 'color',
        from: 'usages.fieldset.legend.color', // when legend is button
      },
    ],
  },
  {
    selector: '.p-fieldset .p-fieldset-toggle-button:hover .p-fieldset-legend-label',
    declarations: [
      {
        property: 'color',
        from: 'usages.fieldset.legend.hover.color',
      },
    ],
  },
]

export const fieldsetCssRules: CssRule[] = [...FIELDSET_LEGEND_LABEL, ...FIELDSET_TOGGLE_ICON]
