import { ComponentHarness } from '@angular/cdk/testing'
import { PSelectHarness } from '@onecx/angular-testing'

export class ColumnGroupSelectionHarness extends ComponentHarness {
  static hostSelector = 'ocx-column-group-selection'

  getPSelect = this.locatorFor(PSelectHarness)
}
