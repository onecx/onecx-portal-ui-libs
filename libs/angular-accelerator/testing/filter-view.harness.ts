import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DataTableHarness } from './data-table.harness'
import { PButtonHarness, PChipHarness, SpanHarness } from '.'

export class FilterViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-filter-view'

  getDataTable = this.documentRootLocatorFactory().locatorForOptional(DataTableHarness)
  getFiltersButton = this.locatorForOptional(PButtonHarness.with({ id: 'manageFiltersButton' }))
  getChipsResetFiltersButton = this.locatorForOptional(PButtonHarness.with({ id: 'resetFiltersButton' }))
  getChips = this.locatorForAll(PChipHarness)
  getNoFiltersMessage = this.locatorForOptional(SpanHarness.with({ id: 'noFiltersMessage' }))
}
