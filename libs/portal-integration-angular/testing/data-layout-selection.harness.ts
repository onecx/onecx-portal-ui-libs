import { ContentContainerComponentHarness, TestElement } from '@angular/cdk/testing'
import { PSelectButtonHarness } from './primeng/p-selectButton.harness'
import { PrimeIcons } from 'primeng/api'

export class DataLayoutSelectionHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-layout-selection'

  async getAllSelectionButtons() {
    return await (await this.locatorFor(PSelectButtonHarness)()).getAllButtons()
  }

  async getListLayoutSelectionButton() {
    return await this.isDesiredButton(await this.getAllSelectionButtons(), PrimeIcons.LIST)
  }

  async getGridLayoutSelectionButton() {
    return await this.isDesiredButton(await this.getAllSelectionButtons(), PrimeIcons.TH_LARGE)
  }

  async getTableLayoutSelectionButton() {
    return await this.isDesiredButton(await this.getAllSelectionButtons(), PrimeIcons.TABLE)
  }

  async getCurrentLayout() {
    return await (await this.host()).getAttribute('ng-reflect-layout')
  }

  async selectListLayout() {
    await (await this.getListLayoutSelectionButton())?.click()
  }

  private async isDesiredButton(value: TestElement[], icon: PrimeIcons) {
    for (let index = 0; index < value.length; index++) {
      if ((await value[index].getAttribute('aria-labelledby')) === icon) {
        return value[index]
      }
    }
    return null
  }
}
