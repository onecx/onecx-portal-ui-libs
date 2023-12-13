import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { PButtonHarness } from './primeng/p-button.harness'

export class ButtonDialogHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-button-dialog'

  getMainButton = this.locatorFor(PButtonHarness.with({ id: 'buttonDialogMainButton' }))
  getSideButton = this.locatorFor(PButtonHarness.with({ id: 'buttonDialogSideButton' }))

  async clickMainButton() {
    await (await this.getMainButton()).click()
  }

  async clickSideButton() {
    await (await this.getSideButton()).click()
  }
}
