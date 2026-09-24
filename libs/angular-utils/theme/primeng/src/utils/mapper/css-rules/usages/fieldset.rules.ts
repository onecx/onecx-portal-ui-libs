import type { CssRule } from '../../mapper.types'

const FIELDSET_PADDING: CssRule[] = [
  {
    selector: '.p-fieldset',
    declarations: [
      { property: 'padding-inline', from: 'usages.fieldset.defaultVariant.paddingX' },
      { property: 'padding-block', from: 'usages.fieldset.defaultVariant.paddingY' },
    ],
  },
  {
    selector: '.p-fieldset .p-fieldset-legend',
    declarations: [
      {
        property: 'padding-inline',
        from: 'usages.fieldset.legendButton.defaultState.paddingX',
      },
      {
        property: 'padding-block',
        from: 'usages.fieldset.legendButton.defaultState.paddingY',
      },
    ],
  },
  {
    selector: '.p-fieldset .p-fieldset-content',
    declarations: [
      { property: 'padding-inline', from: 'usages.fieldset.content.paddingX' },
      { property: 'padding-block', from: 'usages.fieldset.content.paddingY' },
    ],
  },
]

const FIELDSET_TOGGLE_ICON: CssRule[] = [
  {
    selector: '.p-fieldset .p-fieldset-toggle-button .p-fieldset-toggle-icon',
    declarations: [
      {
        property: 'color',
        from: 'usages.fieldset.legendButton.defaultState.toggleIcon.color',
      },
      {
        property: 'width',
        from: 'usages.fieldset.legendButton.defaultState.toggleIcon.width',
      },
      {
        property: 'height',
        from: 'usages.fieldset.legendButton.defaultState.toggleIcon.height',
      },
    ],
  },
  {
    selector: '.p-fieldset .p-fieldset-toggle-button:hover .p-fieldset-toggle-icon',
    declarations: [
      {
        property: 'color',
        from: 'usages.fieldset.legendButton.hover.toggleIcon.color',
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
        from: 'usages.fieldset.legendButton.defaultState.color',
      },
    ],
  },
  {
    selector: '.p-fieldset .p-fieldset-toggle-button .p-fieldset-legend-label',
    declarations: [
      {
        property: 'color',
        from: 'usages.fieldset.legendButton.defaultState.color',
      },
    ],
  },
  {
    selector: '.p-fieldset .p-fieldset-toggle-button:hover .p-fieldset-legend-label',
    declarations: [
      {
        property: 'color',
        from: 'usages.fieldset.legendButton.hover.color',
      },
    ],
  },
]

export const fieldsetCssRules: CssRule[] = [
  ...FIELDSET_PADDING,
  ...FIELDSET_LEGEND_LABEL,
  ...FIELDSET_TOGGLE_ICON,
]
