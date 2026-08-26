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
    ],
  },
]
