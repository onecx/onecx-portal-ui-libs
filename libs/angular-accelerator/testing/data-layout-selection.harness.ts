import { ContentContainerComponentHarness, TestElement } from '@angular/cdk/testing'
import { PToggleButtonHarness } from 'libs/angular-testing/src/lib/harnesses/primeng/p-togglebutton.harness'

export class DataLayoutSelectionHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-layout-selection'

  getListLayoutSelectionToggleButton = this.locatorFor(
    PToggleButtonHarness.with({ onLabel: 'ocx-data-layout-selection-list' })
  )
  getGridLayoutSelectionToggleButton = this.locatorFor(
    PToggleButtonHarness.with({ onLabel: 'ocx-data-layout-selection-grid' })
  )
  getTableLayoutSelectionToggleButton = this.locatorFor(
    PToggleButtonHarness.with({ onLabel: 'ocx-data-layout-selection-table' })
  )

  async getCurrentLayout() {
    return await (await this.host()).getAttribute('ng-reflect-layout')
  }

  async selectListLayout() {
    await (await this.getListLayoutSelectionToggleButton()).click()
  }

  async selectGridLayout() {
    await (await this.getGridLayoutSelectionToggleButton()).click()
  }

  async selectTableLayout() {
    await (await this.getTableLayoutSelectionToggleButton()).click()
  }
}
