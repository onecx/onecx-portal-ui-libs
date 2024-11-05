import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DataTableHarness } from './data-table.harness'
import { PButtonHarness, PChipHarness, SpanHarness } from '.'

export class FilterViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-filter-view'

  getDataTable = this.documentRootLocatorFactory().locatorForOptional(DataTableHarness)
  getOverlayResetFiltersButton = this.documentRootLocatorFactory().locatorForOptional(
    PButtonHarness.with({ id: 'ocxFilterViewOverlayReset' })
  )
  getFiltersButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewManage' }))
  getChipsResetFiltersButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewReset' }))
  getChips = this.locatorForAll(PChipHarness)
  getNoFiltersMessage = this.locatorForOptional(SpanHarness.with({ id: 'ocxFilterViewNoFilters' }))
}
