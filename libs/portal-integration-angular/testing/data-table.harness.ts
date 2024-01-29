import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { TableHeaderColumnHarness } from './table-header-column.harness'
import { TableRowHarness } from './table-row.harness'
import { PTableCheckboxHarness } from './p-tableCheckbox.harness'

export class DataTableHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-table'

  getHeaderColumns = this.locatorForAll(TableHeaderColumnHarness)
  getRows = this.locatorForAll(TableRowHarness)

  async getSelectionCheckboxHarness() {
    const pTableCheckboxHarness = await this.locatorForOptional(PTableCheckboxHarness)()
    return pTableCheckboxHarness
  }

  async rowSelectionIsEnabled(): Promise<boolean> {
    const pTableCheckbox = await this.getSelectionCheckboxHarness()
    return !!pTableCheckbox
  }
}
