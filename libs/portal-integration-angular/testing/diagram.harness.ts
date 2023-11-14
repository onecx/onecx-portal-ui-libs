import { ComponentHarness } from '@angular/cdk/testing'
import { DivHarness } from './div.harness'

export class DiagramHarness extends ComponentHarness {
  static hostSelector = 'ocx-diagram'

  getSumKeyNumber = this.locatorForOptional(DivHarness.with({ class: 'sumKey' }))

  async getSumKey(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-sum-key')
  }

  async getTotalNumber(): Promise<string | undefined> {
    return await (await this.getSumKeyNumber())?.getText()
  }
}
