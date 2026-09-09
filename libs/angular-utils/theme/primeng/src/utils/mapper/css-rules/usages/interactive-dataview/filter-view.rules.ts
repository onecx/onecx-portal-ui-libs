import type { CssRule } from '../../../mapper.types'

export const filterViewRules: CssRule[] = [
  // Focus ring on "show more" chip
  {
    selector: '.filter-view-focusable:focus',
    declarations: [
      {
        property: 'outline-color',
        from: 'usages.interactiveDataView.filterView.chip.color',
      },
      {
        property: 'outline-offset',
        from: 'usages.interactiveDataView.filterView.chip.focusRing.offset',
      },
      {
        property: 'border-radius',
        from: 'usages.interactiveDataView.filterView.chip.focusRing.radius',
      },
    ],
  },
]
