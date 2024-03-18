import { ComponentHarness } from '@angular/cdk/testing'
import { PChartHarness, PSelectButtonHarness } from '@onecx/angular-testing'

export class DiagramHarness extends ComponentHarness {
  static hostSelector = 'ocx-diagram'

  getChart = this.locatorFor(PChartHarness)

  async getTotalNumberOfResults(): Promise<number | undefined> {
    return (await this.locatorForOptional('.sumKey span[name="amountOfData"]')())?.text().then((s) => Number(s))
  }

  async getSumLabel(): Promise<string | undefined> {
    return (await this.locatorForOptional('.sumKey span[name="sumLabel"]')())?.text()
  }

  async getDiagramTypeSelectButton() {
    return await this.locatorForOptional('p-selectButton[name="diagram-type-select-button"]')()
  }

  async getAllSelectionButtons() {
    return await (await this.locatorFor(PSelectButtonHarness)()).getAllButtons()
  }
}
