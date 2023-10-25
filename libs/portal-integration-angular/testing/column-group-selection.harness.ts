import { ComponentHarness } from '@angular/cdk/testing'
import { PDropdownHarness } from './primeng/p-dropdown.harness'

export class ColumnGroupSelectionHarness extends ComponentHarness {
  static hostSelector = 'ocx-column-group-selection'

  getPDropdown = this.locatorFor(PDropdownHarness)
}
