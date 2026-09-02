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

  getAddFilterButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewAddFilter' }))
  getAddFilterColumnSelect = this.locatorForOptional(PSelectHarness.with({ id: 'ocxFilterViewAddFilterColumn' }))
  getAddFilterValueSelect = this.locatorForOptional(PSelectHarness.with({ id: 'ocxFilterViewAddFilterValue' }))
  getAddFilterApplyButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewAddFilterApply' }))
  getAddFilterCancelButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewAddFilterCancel' }))

  async getDataTable() {
    return await this.documentRootLocatorFactory().locatorForOptional(
      DataTableHarness.with({ id: 'ocxFilterViewDataTable' })
    )()
  }

  /** Opens the add-filter form and returns the selectable column options. */
  async getAddFilterColumnOptions() {
    await (await this.getAddFilterButton())?.click()
    return (await (await this.getAddFilterColumnSelect())?.getSelectItems()) ?? []
  }

  /**
   * Ensures the add-filter form is open (opening it if needed) and selects the
   * given column by its visible label.
   */
  async chooseAddFilterColumn(columnText: string) {
    let select = await this.getAddFilterColumnSelect()
    if (!select) {
      await (await this.getAddFilterButton())?.click()
      select = await this.getAddFilterColumnSelect()
    }
    await select?.open()
    await (await select?.getSelectItem(columnText))?.selectItem()
  }

  /** Returns the selectable value options for the currently chosen column. */
  async getAddFilterValueOptions() {
    const select = await this.getAddFilterValueSelect()
    if (!select) {
      return []
    }
    await select.open()
    return (await select.getSelectItems()) ?? []
  }

  /** Chooses a column and value and applies them as a new filter. */
  async chooseAddFilterValue(valueText: string) {
    const select = await this.getAddFilterValueSelect()
    await select?.open()
    await (await select?.getSelectItem(valueText))?.selectItem()
  }

  async applyAddFilter() {
    await (await this.getAddFilterApplyButton())?.click()
  }

  async cancelAddFilter() {
    await (await this.getAddFilterCancelButton())?.click()
  }
}
