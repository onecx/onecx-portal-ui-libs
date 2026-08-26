import type { CssRule } from '../../../mapper.types'

export const customGroupColumnSelectorRules: CssRule[] = [
  // Picklist root background and color (no preset tokens available)
  {
    selector: '.p-picklist',
    declarations: [
      {
        property: 'background-color',
        from: 'usages.interactiveDataView.customGroupColumnSelector.picklist.background',
      },
      {
        property: 'color',
        from: 'usages.interactiveDataView.customGroupColumnSelector.picklist.color',
      },
    ],
  },
  // Picklist button colors
  {
    selector:
      '.p-picklist > div.p-picklist-controls.p-picklist-transfer-controls > button.p-button-secondary,' +
      '.p-picklist > div.p-picklist-controls.p-picklist-source-controls > button.p-button-secondary,' +
      '.p-picklist > div.p-picklist-controls.p-picklist-target-controls > button.p-button-secondary',
    declarations: [
      {
        property: 'background-color',
        from: 'usages.interactiveDataView.customGroupColumnSelector.picklist.background',
      },
      {
        property: 'color',
        from: 'usages.interactiveDataView.customGroupColumnSelector.picklist.color',
      },
    ],
  },
  // Skeleton styling
  {
    selector: '.p-skeleton',
    declarations: [
      {
        property: 'border-radius',
        from: 'usages.interactiveDataView.customGroupColumnSelector.skeleton.border.radius',
      },
      {
        property: 'background-color',
        from: 'usages.interactiveDataView.customGroupColumnSelector.skeleton.background',
      },
    ],
  },
]
