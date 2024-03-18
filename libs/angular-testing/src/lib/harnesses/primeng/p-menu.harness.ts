import { ContentContainerComponentHarness, HarnessLoader } from '@angular/cdk/testing'
import { MenuItemHarness } from '../menu-item.harness'

export class PMenuHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-menu'

  async getHarnessLoaderForPMenuOverlay(): Promise<HarnessLoader | null> {
    return this.documentRootLocatorFactory().harnessLoaderForOptional('.p-menu-overlay')
  }

  async isOpen(): Promise<boolean> {
    return !!(await this.getHarnessLoaderForPMenuOverlay())
  }

  async getAllMenuItems() {
    if (await this.isOpen()) {
      return await (await this.getHarnessLoaderForPMenuOverlay())?.getAllHarnesses(MenuItemHarness)
    } else {
      console.warn('Cannot get menu items because menu is closed.')
    }
    return []
  }
}
