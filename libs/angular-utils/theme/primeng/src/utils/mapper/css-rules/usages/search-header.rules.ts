import type { CssRule } from '../../mapper.types'

export const searchHeaderCssRules: CssRule[] = [
  {
    selector: '.search-header__layout',
    declarations: [
      { property: 'row-gap', from: 'usages.searchHeader.layout.rowGap' },
      { property: 'column-gap', from: 'usages.searchHeader.layout.columnGap' },
    ],
  },
  {
    selector: '.search-header__search-reset-panel',
    declarations: [
      { property: 'gap', from: 'usages.searchHeader.controls.gap' },
      { property: 'padding', from: 'usages.searchHeader.searchResetPanel.padding' },
      { property: 'align-items', from: 'usages.searchHeader.searchResetPanel.alignItems' },
    ],
  },
]
