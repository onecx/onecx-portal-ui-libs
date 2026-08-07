import type { CssRule } from '../../mapper.types'

export const selectbuttonCssRules: CssRule[] = [
  // Container properties
  {
    selector: '.p-selectbutton',
    declarations: [
      {
        property: 'gap',
        from: 'usages.selectbutton.gap',
      },
      {
        property: 'border-color',
        from: 'usages.selectbutton.border.color',
      },
      {
        property: 'border-style',
        from: 'usages.selectbutton.border.style',
      },
      {
        property: 'border-width',
        from: 'usages.selectbutton.border.width',
      },
      {
        property: 'border-radius',
        from: 'usages.selectbutton.border.radius',
      },
    ],
  },
]
