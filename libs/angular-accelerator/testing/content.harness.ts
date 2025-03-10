import { ComponentHarness } from '@angular/cdk/testing'
import { DivHarness, PHarness } from '@onecx/angular-testing'

export class OcxContentHarness extends ComponentHarness {
  static hostSelector = 'ocx-content'

  async getContentClasses() {
    const div = await this.locatorFor(DivHarness)()
    const actualClassList = await div.getClassList()

    return actualClassList
  }

  async getTitleClasses(titleElementId: string) {
    const p = await this.getTitleHarness(titleElementId)
    if (p) {
      const actualClassList = await p.getClassList()
      return actualClassList
    }
    return null
  }

  async getTitle(titleElementId: string) {
    const p = await this.getTitleHarness(titleElementId)
    if (p) {
      const titleContent = await p.getText()
      return titleContent
    }
    return null
  }

  async getTitleHarness(titleElementId: string) {
    const pHarness = await this.locatorForOptional(PHarness.with({ id: titleElementId }))()
    return pHarness
  }

  async hasTitle(titleElementId: string): Promise<boolean> {
    const title = await this.getTitleHarness(titleElementId)
    return !!title
  }
}
