import type { CssRule } from '../../mapper.types'

export const dataListGridCssRules: CssRule[] = [
  {
    selector: '.list-border-divider',
    declarations: [
      {
        property: 'border-color',
        from: 'usages.dataListGrid.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.dataListGrid.border.width',
      },
    ],
  },
  {
    selector: '.grid-border-divider',
    declarations: [
      {
        property: 'border-color',
        from: 'usages.dataListGrid.border.color',
      },
      {
        property: 'border-width',
        from: 'usages.dataListGrid.border.width',
      },
    ],
  },
]