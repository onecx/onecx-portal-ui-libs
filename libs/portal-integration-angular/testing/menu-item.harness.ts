import { ComponentHarness } from '@angular/cdk/testing'

export class MenuItemHarness extends ComponentHarness {
  static hostSelector = 'li > a'

  async getText() {
    return await (await this.host()).text()
  }

  async selectItem() {
    await (await this.host()).click()
  }
}
