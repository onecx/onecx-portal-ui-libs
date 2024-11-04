import { ComponentHarness } from '@angular/cdk/testing'

export class PChipHarness extends ComponentHarness {
  static hostSelector = 'p-chip'

  getRemoveButton = this.locatorForOptional('.pi-chip-remove-icon')

  async getContent() {
    return await (await this.host()).text()
  }

  async clickRemove() {
    await (await this.getRemoveButton())?.click()
  }

  async click() {
    await (await this.host()).click()
  }
}
