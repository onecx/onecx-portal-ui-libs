import { CssRule } from '../../mapper.types'

export const breadcrumbCssRules: CssRule[] = [
  {
    selector: '.p-breadcrumb .p-breadcrumb-item',
    declarations: [
      {
        property: 'font-weight',
        from: 'usages.breadcrumb.item.label.font.weight',
      },
      {
        property: 'font-size',
        from: 'usages.breadcrumb.item.label.font.size',
      },
    ],
  },
]
