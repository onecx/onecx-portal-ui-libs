import type { CssRule } from '../../mapper.types'

export const menuCssRules: CssRule[] = [
  {
    selector: '.p-menu-item-label',
    declarations: [
      {
        property: 'font-weight',
        from: 'usages.menu.item.label.font.weight',
      },
      {
        property: 'font-size',
        from: 'usages.menu.item.label.font.size',
      },
    ],
  },
]
