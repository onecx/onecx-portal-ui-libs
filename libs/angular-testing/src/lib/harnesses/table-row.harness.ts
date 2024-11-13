import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { ButtonHarness } from './button.harness'
import { waitForDeferredViewsToBeRendered } from '../utils/waitForDeferredViewsToBeRendered'

export class TableRowHarness extends ContentContainerComponentHarness {
  static hostSelector = 'tbody > tr'

  getAllActionButtons = this.locatorForAll('button')
  getViewButton = this.locatorForOptional(ButtonHarness.with({ class: 'viewTableRowButton' }))
  getEditButton = this.locatorForOptional(ButtonHarness.with({ class: 'editTableRowButton' }))
  getDeleteButton = this.locatorForOptional(ButtonHarness.with({ class: 'deleteTableRowButton' }))

  async getData(): Promise<string[]> {
    await waitForDeferredViewsToBeRendered(this)
    const tds = await this.locatorForAll('td')()
    const isActionsTd = await Promise.all(tds.map((t) => t.hasClass('actions')))
    const textTds = tds.filter((_v, index) => !isActionsTd[index])
    return Promise.all(textTds.map((t) => t.text()))
  }
}
