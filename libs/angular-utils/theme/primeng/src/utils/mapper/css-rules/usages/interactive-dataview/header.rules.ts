import type { CssRule } from '../../../mapper.types'

export const headerRules: CssRule[] = [
  {
    selector: '#interactiveDataViewHeader',
    declarations: [
      {
        property: 'border-color',
        from: 'usages.interactiveDataView.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.interactiveDataView.border.width',
      },
      {
        property: 'background',
        from: 'usages.interactiveDataView.background',
      },
      {
        property: 'color',
        from: 'usages.interactiveDataView.color',
      },
      {
        property: 'gap',
        from: 'usages.interactiveDataView.gap',
      },
      {
        property: 'padding-inline',
        from: 'usages.interactiveDataView.paddingX',
      },
      {
        property: 'padding-block',
        from: 'usages.interactiveDataView.paddingY',
      },
    ],
  },
]
