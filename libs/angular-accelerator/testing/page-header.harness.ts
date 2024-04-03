import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import {
  ListItemHarness,
  MenuItemHarness,
  PBreadcrumbHarness,
  PButtonHarness,
  PMenuHarness,
} from '@onecx/angular-testing'

export class PageHeaderHarness extends ComponentHarness {
  static hostSelector = 'ocx-page-header'

  getPageHeaderWrapperHarness = this.locatorForAll('[name="ocx-page-header-wrapper"]')
  getBreadcrumb = this.locatorForOptional(PBreadcrumbHarness)
  getMenu = this.locatorForOptional(PMenuHarness)

  async getElementByTitle(title: string) {
    return await this.locatorForOptional(`[title="${title}"]`)()
  }

  async getObjectInfos() {
    return await this.locatorForAll(ObjectDetailItemHarness)()
  }

  async getObjectInfoByLabel(objectInfolabel: string) {
    return await this.locatorForOptional(ObjectDetailItemHarness.with({ label: objectInfolabel }))()
  }

  async getInlineActionButtons() {
    const inlineActionButtons = await this.locatorForAll(
      PButtonHarness.with({ name: 'ocx-page-header-inline-action-button' })
    )()
    const inlineActionIconButtons = await this.locatorForAll(
      PButtonHarness.with({ name: 'ocx-page-header-inline-action-icon-button' })
    )()
    return inlineActionButtons.concat(inlineActionIconButtons)
  }

  async getInlineActionButtonByLabel(buttonLabel: string) {
    return await this.locatorForOptional(PButtonHarness.with({ label: buttonLabel }))()
  }

  async getInlineActionButtonByIcon(buttonIcon: string) {
    return await this.locatorForOptional(PButtonHarness.with({ icon: buttonIcon }))()
  }

  async getOverflowActionButton() {
    return await this.locatorForOptional('[name="ocx-page-header-overflow-action-button"]')()
  }

  async getOverFlowMenuItems() {
    const menu = await this.getMenu()
    const menuItems = await menu?.getAllMenuItems()
    return menuItems ?? []
  }

  async getOverFlowMenuItem(itemText: string): Promise<MenuItemHarness | undefined | null> {
    const menu = await this.getMenu()
    return await menu?.getMenuItem(itemText)
  }

  async getBreadcrumbItem(itemText: string): Promise<ListItemHarness | undefined | null> {
    const breadcrumb = await this.getBreadcrumb()
    return await breadcrumb?.getBreadcrumbItem(itemText)
  }

  async getHeaderText(): Promise<string | undefined> {
    return await (await this.locatorForOptional('#page-header')())?.text()
  }

  async getSubheaderText(): Promise<string | undefined> {
    return await (await this.locatorForOptional('#page-subheader')())?.text()
  }
}

interface ObjectDetailItemHarnessFilters extends BaseHarnessFilters {
  label?: string
}

class ObjectDetailItemHarness extends ComponentHarness {
  static hostSelector = '.object-info'

  getLabelElement = this.locatorFor('[name="object-detail-label"]')
  getValueElement = this.locatorForOptional('[name="object-detail-value"]')
  getIconElement = this.locatorForOptional('[name="object-detail-icon"]')

  static with(options: ObjectDetailItemHarnessFilters): HarnessPredicate<ObjectDetailItemHarness> {
    return new HarnessPredicate(ObjectDetailItemHarness, options).addOption('label', options.label, (harness, label) =>
      HarnessPredicate.stringMatches(harness.getLabel(), label)
    )
  }

  async getLabel() {
    return (await this.getLabelElement()).text()
  }

  async getValue() {
    return (await this.getValueElement())?.text()
  }

  async getIcon() {
    return (await this.getIconElement())?.getAttribute('class')
  }
}
