import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { CustomGroupColumnSelectorHarness } from '.'
import { DataLayoutSelectionHarness } from './data-layout-selection.harness'
import { DataViewHarness } from './data-view.harness'
import { PButtonHarness } from './primeng/p-button.harness'
import { PDropdownHarness } from './primeng/p-dropdown.harness'

export class InteractiveDataViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-interactive-data-view'

  getDataLayoutSelection = this.locatorFor(DataLayoutSelectionHarness)
  getColumnGroupSelectionDropdown = this.locatorForOptional(
    PDropdownHarness.with({ id: 'columnGroupSelectionDropdown' })
  )
  getCustomGroupColumnSelector = this.locatorFor(CustomGroupColumnSelectorHarness)
  getDataListGridSortingDropdown = this.locatorForOptional(PDropdownHarness.with({ id: 'dataListGridSortingDropdown' }))
  getDataListGridSortingButton = this.locatorForOptional(PButtonHarness.with({ id: 'dataListGridSortingButton' }))
  getDataView = this.locatorFor(DataViewHarness)
}
