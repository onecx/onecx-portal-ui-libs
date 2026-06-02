import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { PToggleButtonHarness } from '@onecx/angular-testing'

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

  async getCurrentLayout(): Promise<'list' | 'grid' | 'table' | null> {
    if (await (await this.getListLayoutSelectionToggleButton()).isChecked()) {
      return 'list';
    }
    if (await (await this.getGridLayoutSelectionToggleButton()).isChecked()) {
      return 'grid';
    }
    if (await (await this.getTableLayoutSelectionToggleButton()).isChecked()) {
      return 'table';
    }

    return null;
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
