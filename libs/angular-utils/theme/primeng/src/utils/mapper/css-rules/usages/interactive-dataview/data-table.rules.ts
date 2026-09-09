import type { CssRule } from '../../../mapper.types'

export const dataTableRules: CssRule[] = [
  // Header cell column title styling
  {
    selector: '.table-header-wrapper',
    declarations: [
      {
        property: 'font-weight',
        from: 'usages.interactiveDataView.dataView.dataTable.columnTitle.font.weight',
      },
    ],
  },
]
