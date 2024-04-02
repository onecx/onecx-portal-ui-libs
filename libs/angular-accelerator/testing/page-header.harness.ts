import { ComponentHarness } from '@angular/cdk/testing'
import { ListItemHarness, MenuItemHarness, PBreadcrumbHarness, PMenuHarness } from '@onecx/angular-testing'

export class PageHeaderHarness extends ComponentHarness {
  static hostSelector = 'ocx-page-header'

  getPageHeaderWrapperHarness = this.locatorForAll('[name="ocx-page-header-wrapper"]')
  getBreadcrumb = this.locatorFor(PBreadcrumbHarness)
  getMenu = this.locatorFor(PMenuHarness)

  async getInlineActionButtons() {
    return await this.locatorForAll('[name="ocx-page-header-inline-action-button"]')()
  }

  async getOverflowActionButton() {
    return await this.locatorFor('[name="ocx-page-header-overflow-action-button"]')()
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
    const menu = await this.getMenu()
    const menuItems = await menu.getAllMenuItems()
    return menuItems ?? []
  }

  async getOverFlowMenuItem(itemText: string): Promise<MenuItemHarness | undefined | null> {
    const menu = await this.getMenu()
    return await menu.getMenuItem(itemText)
  }

  async getBreadcrumbItem(itemText: string): Promise<ListItemHarness | undefined | null> {
    const breadcrumb = await this.getBreadcrumb()
    return await breadcrumb.getBreadcrumbItem(itemText)
  }

  async getHeaderText(): Promise<string | undefined> {
    return await (await this.locatorForOptional('#page-header')())?.text()
  }

  async getSubheaderText(): Promise<string | undefined> {
    return await (await this.locatorForOptional('#page-subheader')())?.text()
  }
}
