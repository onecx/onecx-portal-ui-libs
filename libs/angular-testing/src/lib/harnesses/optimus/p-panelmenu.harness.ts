import { ComponentHarness } from '@angular/cdk/testing'
import { PanelMenuItemHarness } from './p-panelmenu-item.harness'

export class PPanelMenuHarness extends ComponentHarness {
  static hostSelector = 'p-panelmenu'

  getAllPanels = this.locatorForAll(PanelMenuItemHarness)
}
