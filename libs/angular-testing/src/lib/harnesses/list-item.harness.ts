import { ComponentHarness } from '@angular/cdk/testing'

export class ListItemHarness extends ComponentHarness {
  static hostSelector = 'li'

  async getText() {
    return await (await this.host()).text()
  }

  async isSelected(): Promise<boolean> {
    return (await (await this.host()).getAttribute('aria-selected')) === 'true' ? true : false
  }

  async selectItem() {
    await (await this.host()).click()
  }
}
