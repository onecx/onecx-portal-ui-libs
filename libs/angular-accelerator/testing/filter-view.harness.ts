import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DataTableHarness } from './data-table.harness'
import { ButtonHarness, PButtonHarness, PChipHarness, SpanHarness } from '@onecx/angular-testing'

export class FilterViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-filter-view'

  getOverlayResetFiltersButton = this.documentRootLocatorFactory().locatorForOptional(
    PButtonHarness.with({ id: 'ocxFilterViewOverlayReset' })
  )
  getFiltersButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewManage' }))
  getChipsResetFiltersButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewReset' }))
  /** The removable filter chips. The "add filter" and "+N more" chips are buttons, see the getters below. */
  getChips = this.locatorForAll(PChipHarness)
  getAddFilterChip = this.locatorForOptional(ButtonHarness.with({ id: 'ocxFilterViewAddFilterChip' }))
  getShowMoreChip = this.locatorForOptional(ButtonHarness.with({ id: 'ocxFilterViewShowMore' }))
  getNoFiltersMessage = this.locatorForOptional(SpanHarness.with({ id: 'ocxFilterViewNoFilters' }))

  /** The add filter chip stays focusable when no column is filterable and is marked with aria-disabled. */
  async isAddFilterChipDisabled(): Promise<boolean> {
    const chip = await this.locatorForOptional('#ocxFilterViewAddFilterChip')()
    return (await chip?.getAttribute('aria-disabled')) === 'true'
  }

  async getDataTable() {
    return await this.documentRootLocatorFactory().locatorForOptional(
      DataTableHarness.with({ id: 'ocxFilterViewDataTable' })
    )()
  }
}
