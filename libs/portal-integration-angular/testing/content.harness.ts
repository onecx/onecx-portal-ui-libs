import { ComponentHarness } from '@angular/cdk/testing'
import { DivHarness } from './div.harness'
import { PHarness } from './p.harness'

export class OcxContentHarness extends ComponentHarness {
  static hostSelector = 'ocx-content'

  async getContentClasses() {
    const div = await this.locatorFor(DivHarness)()
    const actualClassList = await div.getClassList()

    return actualClassList
  }

  async getTitleClasses() {
    const p = await this.getTitleHarness()
    if (p) {
      const actualClassList = await p.getClassList()
      return actualClassList
    }
    return null
  }

  async getTitle() {
    const p = await this.getTitleHarness()
    if (p) {
      const titleContent = await p.getText()
      return titleContent
    }
    return null
  }

  async getTitleHarness() {
    const pHarness = await this.locatorForOptional(PHarness.with({ id: 'ocxContentTitleElement' }))()
    return pHarness
  }

  async hasTitle(): Promise<boolean> {
    const title = await this.getTitleHarness()
    return !!title
  }
}
