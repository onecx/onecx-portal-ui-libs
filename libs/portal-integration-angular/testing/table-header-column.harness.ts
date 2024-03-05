import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { ButtonHarness } from './button.harness'
import { PMultiSelectHarness } from './primeng/p-multiSelect.harness'

export class TableHeaderColumnHarness extends ContentContainerComponentHarness {
  static hostSelector = 'th'

  getSortButton = this.locatorFor(
    ButtonHarness.with({
      class: 'sortButton',
    })
  )

  getFilterMultiSelect = this.locatorFor(
    PMultiSelectHarness.with({
      class: 'filterMultiSelect',
    })
  )

  async getText(): Promise<string> {
    return (await this.host()).text()
  }
}
