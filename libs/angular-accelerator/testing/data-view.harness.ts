import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DataListGridHarness } from './data-list-grid.harness'
import { DataTableHarness } from './data-table.harness'

export class DataViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-view'

  getDataTable = this.locatorForOptional(DataTableHarness)
  getDataListGrid = this.locatorForOptional(DataListGridHarness)
}
