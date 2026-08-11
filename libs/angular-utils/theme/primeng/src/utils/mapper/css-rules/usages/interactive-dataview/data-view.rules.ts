import type { CssRule } from '../../../mapper.types'

export const dataViewRules: CssRule[] = [
  // DataView root gap (no preset token available)
  {
    selector: '.p-dataview',
    declarations: [
      {
        property: 'gap',
        from: 'usages.interactiveDataView.dataView.gap',
      },
    ],
  },
  // DataView content gap and padding (no preset tokens for paddingX/Y/gap)
  {
    selector: '.p-dataview-content',
    declarations: [
      {
        property: 'padding-inline',
        from: 'usages.interactiveDataView.dataView.dataViewContent.paddingX',
      },
      {
        property: 'padding-block',
        from: 'usages.interactiveDataView.dataView.dataViewContent.paddingY',
      },
      {
        property: 'gap',
        from: 'usages.interactiveDataView.dataView.dataViewContent.gap',
      },
    ],
  },
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
