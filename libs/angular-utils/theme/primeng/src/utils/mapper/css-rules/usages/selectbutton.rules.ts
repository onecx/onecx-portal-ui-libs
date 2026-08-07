import type { CssRule } from '../../mapper.types'

export const selectbuttonCssRules: CssRule[] = [
  // Gap between buttons
  {
    selector: '.p-selectbutton',
    declarations: [
      {
        property: 'gap',
        from: 'usages.selectbutton.gap',
      },
    ],
  },
]
