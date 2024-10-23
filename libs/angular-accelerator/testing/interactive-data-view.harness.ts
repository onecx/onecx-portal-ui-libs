import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DivHarness, PButtonHarness } from '@onecx/angular-testing'
import { PDropdownHarness } from '@onecx/angular-testing'
import { CustomGroupColumnSelectorHarness } from '.'
import { DataLayoutSelectionHarness } from './data-layout-selection.harness'
import { DataViewHarness } from './data-view.harness'
import { SlotHarness } from './slot.harness'

export class InteractiveDataViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-interactive-data-view'

  async getContentClassesById(id: string) {
    const div = await this.locatorFor(DivHarness.with({ selector: `[id="${id}"]` }))()
    const actualClassList = await div.getClassList()

    return actualClassList
  }

  getDataLayoutSelection = this.locatorFor(DataLayoutSelectionHarness)
  getColumnGroupSelectionDropdown = this.locatorForOptional(
    PDropdownHarness.with({ id: 'columnGroupSelectionDropdown' })
  )
  getCustomGroupColumnSelector = this.locatorForOptional(CustomGroupColumnSelectorHarness)
  getCustomGroupColumnSelectorSlot = this.locatorForOptional(SlotHarness)
  getDataListGridSortingDropdown = this.locatorForOptional(PDropdownHarness.with({ id: 'dataListGridSortingDropdown' }))
  getDataListGridSortingButton = this.locatorForOptional(PButtonHarness.with({ id: 'dataListGridSortingButton' }))
  getDataView = this.locatorFor(DataViewHarness)
}
