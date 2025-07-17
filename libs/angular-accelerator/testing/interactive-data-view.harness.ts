import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DivHarness, PButtonHarness } from '@onecx/angular-testing'
import { PSelectHarness } from '@onecx/angular-testing'
import { DataLayoutSelectionHarness } from './data-layout-selection.harness'
import { DataViewHarness } from './data-view.harness'
import { SlotHarness } from './slot.harness'
import { CustomGroupColumnSelectorHarness } from './custom-group-column-selector.harness'

export class InteractiveDataViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-interactive-data-view'

  async getHeaderStyleClasses() {
    const headerDiv = await this.locatorFor(DivHarness.with({ id: 'interactiveDataViewHeader' }))()
    const headerClassList = await headerDiv.getClassList()
    return headerClassList
  }

  async getContentStyleClasses() {
    const contentDiv = await this.locatorFor(DivHarness.with({ id: 'interactiveDataViewContent' }))()
    const contentClassList = await contentDiv.getClassList()
    return contentClassList
  }

  getDataLayoutSelection = this.locatorFor(DataLayoutSelectionHarness)
  getColumnGroupSelectionSelect = this.locatorForOptional(PSelectHarness.with({ id: 'columnGroupSelectionSelect' }))
  getCustomGroupColumnSelector = this.locatorForOptional(CustomGroupColumnSelectorHarness)
  getCustomGroupColumnSelectorSlot = this.locatorForOptional(SlotHarness)
  getDataListGridSortingSelect = this.locatorForOptional(PSelectHarness.with({ id: 'dataListGridSortingSelect' }))
  getDataListGridSortingButton = this.locatorForOptional(PButtonHarness.with({ id: 'dataListGridSortingButton' }))
  getDataView = this.locatorFor(DataViewHarness)
}
