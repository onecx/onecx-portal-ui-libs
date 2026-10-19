import { ComponentHarness } from '@angular/cdk/testing'
import { PMenuItemHarness } from './p-menu-item.harness'

export class PMenuBarHarness extends ComponentHarness {
  static hostSelector = 'p-menubar'

  getAllMenuItems = this.locatorForAll(PMenuItemHarness)
}
