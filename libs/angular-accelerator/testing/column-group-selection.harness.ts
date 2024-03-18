import { ComponentHarness } from '@angular/cdk/testing'
import { PDropdownHarness } from '@onecx/angular-testing'

export class ColumnGroupSelectionHarness extends ComponentHarness {
  static hostSelector = 'ocx-column-group-selection'

  getPDropdown = this.locatorFor(PDropdownHarness)
}
