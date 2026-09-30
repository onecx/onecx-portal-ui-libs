import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DataTableHarness } from './data-table.harness'
import { PButtonHarness, PChipHarness, PSelectHarness, SpanHarness } from '@onecx/angular-testing'

export class FilterViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-filter-view'

  getOverlayResetFiltersButton = this.documentRootLocatorFactory().locatorForOptional(
    PButtonHarness.with({ id: 'ocxFilterViewOverlayReset' })
  )
  getFiltersButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewManage' }))
  getChipsResetFiltersButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewReset' }))
  getChips = this.locatorForAll(PChipHarness)
  getNoFiltersMessage = this.locatorForOptional(SpanHarness.with({ id: 'ocxFilterViewNoFilters' }))

  /** "Add filter" button rendered inline in chips mode. */
  getAddFilterButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewAddFilter' }))

  /** "Add filter" button rendered in the header of the manage (button-mode) panel. */
  getPanelAddFilterButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewPanelAddFilter' }))

  /** Column selector inside the add-filter dialog. */
  getAddFilterColumnSelect = this.documentRootLocatorFactory().locatorForOptional(
    PSelectHarness.with({ id: 'filterViewAddFilterColumn' })
  )

  /** Value selector inside the add-filter dialog. */
  getAddFilterValueSelect = this.documentRootLocatorFactory().locatorForOptional(
    PSelectHarness.with({ id: 'filterViewAddFilterValue' })
  )

  /**
   * Opens the add-filter dialog from the currently available affordance
   * (chips-mode pill, or in-panel button).
   */
  async clickAddFilterButton() {
    const chipButton = await this.getAddFilterButton()
    if (chipButton) {
      await chipButton.click()
      return
    }
    const panelButton = await this.getPanelAddFilterButton()
    if (panelButton) {
      await panelButton.click()
    }
  }

  async getDataTable() {
    return await this.documentRootLocatorFactory().locatorForOptional(
      DataTableHarness.with({ id: 'ocxFilterViewDataTable' })
    )()
  }
}
