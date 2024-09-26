import { ContentContainerComponentHarness, TestElement } from '@angular/cdk/testing'
import { PrimeIcons } from 'primeng/api'
import { PSelectButtonHarness, PrimeIcon } from '@onecx/angular-testing'

export class DataLayoutSelectionHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-layout-selection'

  async getAllSelectionButtons() {
    return await (await this.locatorFor(PSelectButtonHarness)()).getAllButtons()
  }

  async getListLayoutSelectionButton() {
    return await this.isDesiredButton(await this.getAllSelectionButtons(), 'ocx-data-layout-selection-list')
  }

  async getGridLayoutSelectionButton() {
    return await this.isDesiredButton(await this.getAllSelectionButtons(), 'ocx-data-layout-selection-grid')
  }

  async getTableLayoutSelectionButton() {
    return await this.isDesiredButton(await this.getAllSelectionButtons(), 'ocx-data-layout-selection-table')
  }

  async getCurrentLayout() {
    return await (await this.host()).getAttribute('ng-reflect-layout')
  }

  async selectListLayout() {
    await (await this.getListLayoutSelectionButton())?.click()
  }

  private async isDesiredButton(value: TestElement[], id: string) {
    for (let index = 0; index < value.length; index++) {
      if ((await value[index].getAttribute('aria-labelledby')) === id) {
        return value[index]
      }
    }
    return null
  }
}
