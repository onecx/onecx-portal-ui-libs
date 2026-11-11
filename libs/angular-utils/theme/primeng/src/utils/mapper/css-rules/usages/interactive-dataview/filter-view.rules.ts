import type { CssRule } from '../../../mapper.types'

export const filterViewRules: CssRule[] = [
  {
    selector: 'ocx-filter-view',
    declarations: [
      {
        property: 'border-color',
        from: 'usages.interactiveDataView.filterView.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.interactiveDataView.filterView.border.width',
      },
      {
        property: 'background',
        from: 'usages.interactiveDataView.filterView.background',
      },
      {
        property: 'color',
        from: 'usages.interactiveDataView.filterView.color',
      },
      {
        property: 'gap',
        from: 'usages.interactiveDataView.filterView.gap',
      },
      {
        property: 'padding-inline',
        from: 'usages.interactiveDataView.filterView.paddingX',
      },
      {
        property: 'padding-block',
        from: 'usages.interactiveDataView.filterView.paddingY',
      },
    ],
  },
]
