import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { PButtonHarness } from '@onecx/angular-testing'
import { PDropdownHarness } from '@onecx/angular-testing'
import { CustomGroupColumnSelectorHarness } from '.'
import { DataLayoutSelectionHarness } from './data-layout-selection.harness'
import { DataViewHarness } from './data-view.harness'

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
