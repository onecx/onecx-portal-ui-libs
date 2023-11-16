import { ComponentHarness } from '@angular/cdk/testing'
import { DivHarness } from './div.harness'

export class DiagramHarness extends ComponentHarness {
  static hostSelector = 'ocx-diagram'

  getSumKey = this.locatorForOptional(DivHarness.with({ class: 'sumKey' }))

  async getTotalNumber(): Promise<string | undefined> {
    return await (await this.getSumKey())?.getText()
  }
}
