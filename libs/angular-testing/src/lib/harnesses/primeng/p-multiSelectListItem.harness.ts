import { ComponentHarness, TestElement } from '@angular/cdk/testing'

export class PMultiSelectListItemHarness extends ComponentHarness {
  static hostSelector = 'li'

  async getTestElement(): Promise<TestElement> {
    return await this.host()
  }

  async click(): Promise<void> {
    await (await this.host()).click()
  }

  async getText(): Promise<string> {
    return await (await this.host()).text()
  }
}
