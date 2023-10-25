import { ContentContainerComponentHarness, HarnessLoader } from '@angular/cdk/testing'
import { MenuItemHarness } from './menu-item.harness'

export class MoreActionsMenuButtonHarness extends ContentContainerComponentHarness {
  static hostSelector = '.more-actions-menu-button'

  async getHarnessLoaderForPMenuOverlay(): Promise<HarnessLoader | null> {
    return this.documentRootLocatorFactory().harnessLoaderForOptional('.p-menu-overlay')
  }

  async isOpen(): Promise<boolean> {
    return !!(await this.getHarnessLoaderForPMenuOverlay())
  }

  async open() {
    if (!(await this.isOpen())) {
      await (await this.host()).click()
    } else {
      console.warn('Unable to open multiSelect, because it is already open.')
    }
  }

  async close() {
    if (await this.isOpen()) {
      await (await this.host()).click()
    } else {
      console.warn('Unable to open multiSelect, because it is already open.')
    }
  }

  async getAllActionsMenuItems() {
    await this.open()
    if (await this.getHarnessLoaderForPMenuOverlay()) {
      return this.documentRootLocatorFactory().locatorForAll(MenuItemHarness)()
    }
    return []
  }
}
