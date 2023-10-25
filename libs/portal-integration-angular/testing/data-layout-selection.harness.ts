import { ContentContainerComponentHarness, TestElement } from '@angular/cdk/testing'
import { PSelectButtonHarness } from './primeng/p-selectButton.harness'

export class DataLayoutSelectionHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-layout-selection'

  async getAllSelectionButtons() {
    return await (await this.locatorFor(PSelectButtonHarness)()).getAllButtons()
  }

  async getListLayoutSelectionButton() {
    return await this.isDesiredButton(await this.getAllSelectionButtons(), 'pi pi-list')
  }

  async getGridLayoutSelectionButton() {
    return await this.isDesiredButton(await this.getAllSelectionButtons(), 'pi pi-th-large')
  }

  async getTableLayoutSelectionButton() {
    return await this.isDesiredButton(await this.getAllSelectionButtons(), 'pi pi-table')
  }

  async getCurrentLayout() {
    return await (await this.host()).getAttribute('ng-reflect-layout')
  }

  async selectListLayout() {
    await (await this.getListLayoutSelectionButton())?.click()
  }

  private async isDesiredButton(value: TestElement[], icon: string) {
    for (let index = 0; index < value.length; index++) {
      if ((await value[index].getAttribute('aria-labelledby')) === icon) {
        return value[index]
      }
    }
    return null
  }
}
