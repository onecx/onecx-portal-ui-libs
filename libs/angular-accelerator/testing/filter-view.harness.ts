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
  getNoFiltersMessage = this.locatorForOptional(SpanHarness.with({ id: 'ocxFilterViewNoFilters' }))

  /** "Add filter" chip rendered inline in chips mode. */
  getAddFilterButton = this.locatorForOptional(PChipHarness.with({ id: 'ocxFilterViewAddFilter' }))

  /**
   * The filter chips (one per applied filter, plus the "+n" show-more chip) — the affordance the user
   * manages. The inline "add filter" chip is an action, not a filter chip, so it is excluded.
   */
  async getChips() {
    const chips = await this.locatorForAll(PChipHarness)()
    const filtered: PChipHarness[] = []
    for (const chip of chips) {
      if ((await chip.getId()) !== 'ocxFilterViewAddFilter') {
        filtered.push(chip)
      }
    }
    return filtered
  }

  /**
   * "Add filter" button rendered in the header of the manage (button-mode) panel. The panel is a popover
   * overlay that PrimeNG teleports outside the host subtree, so it is located on the document root (like the
   * dialog's selectors) rather than within the host.
   */
  getPanelAddFilterButton = this.documentRootLocatorFactory().locatorForOptional(
    PButtonHarness.with({ id: 'ocxFilterViewPanelAddFilter' })
  )

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
