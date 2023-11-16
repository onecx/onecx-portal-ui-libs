import { ComponentHarness } from '@angular/cdk/testing'

export class DiagramHarness extends ComponentHarness {
  static hostSelector = 'ocx-diagram'

  async getTotalNumberOfResults(): Promise<number | undefined> {
    return (await this.locatorForOptional('.sumKey span[name="amountOfData"]')())?.text().then((s) => Number(s))
  }

  async getSumLabel(): Promise<string | undefined> {
    return (await this.locatorForOptional('.sumKey span[name="sumLabel"]')())?.text()
  }
}
