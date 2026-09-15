import type { CssRule } from '../../../mapper.types'

export const dataListGridRules: CssRule[] = [
  // Data list grid divider styling
  {
    selector: '.list-border-divider',
    declarations: [
      {
        property: 'border-color',
        from: 'usages.interactiveDataView.dataView.dataListGrid.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.interactiveDataView.dataView.dataListGrid.border.width',
      },
    ],
  },
  {
    selector: '.grid-border-divider',
    declarations: [
      {
        property: 'border-color',
        from: 'usages.interactiveDataView.dataView.dataListGrid.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.interactiveDataView.dataView.dataListGrid.border.width',
      },
    ],
  },
]
