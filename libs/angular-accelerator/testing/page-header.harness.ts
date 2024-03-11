import { ComponentHarness } from '@angular/cdk/testing'
import { PMenuHarness } from '@onecx/angular-testing'

export class PageHeaderHarness extends ComponentHarness {
  static hostSelector = 'ocx-page-header'

  getPageHeaderWrapperHarness = this.locatorForAll('[name="ocx-page-header-wrapper"]')

  async getInlineActionButtons() {
    return await this.locatorForAll('[name="ocx-page-header-inline-action-button"]')()
  }

  async getOverflowActionButtons() {
    return await this.locatorForAll('[name="ocx-page-header-overflow-action-button"]')()
  }

  async getElementByTitle(title: string) {
    return await this.locatorForOptional(`[title="${title}"]`)()
  }

  async getObjectInfos() {
    return await this.locatorForAll('.object-info')()
  }

  async getObjectDetailLabels() {
    return await this.locatorForAll('[name="object-detail-label"]')()
  }

  async getObjectDetailValues() {
    return await this.locatorForAll('[name="object-detail-value"]')()
  }

  async getObjectDetailIcons() {
    return await this.locatorForAll('[name="object-detail-icon"]')()
  }

  async getOverFlowMenuItems() {
    const menu = await this.locatorFor(PMenuHarness)()
    const menuItems = await menu.getAllMenuItems()
    return menuItems ?? []
  }
}
