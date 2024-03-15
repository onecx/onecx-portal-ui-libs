import { ContentContainerComponentHarness, TestElement } from '@angular/cdk/testing'
import { DefaultGridItemHarness } from './default-grid-item.harness'
import { DefaultListItemHarness } from './default-list-item.harness'
import { PPaginatorHarness } from './primeng/p-paginator.harness'

export class DataListGridHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-list-grid'

  getDefaultGridItems = this.locatorForAll(DefaultGridItemHarness)
  getDefaultListItems = this.locatorForAll(DefaultListItemHarness)
  getPaginator = this.locatorFor(PPaginatorHarness)
  getMenuButton = this.locatorFor(`[name="data-grid-item-menu-button"]`)

  async getActionButtons(actionButtonType: 'list' | 'grid' | 'grid-hidden') {
    if(actionButtonType === 'list') {
      return await this.locatorForAll(`[name="data-list-action-button"]`)()
    } else if (actionButtonType === 'grid-hidden') {
      return await this.documentRootLocatorFactory().locatorForAll(`[data-automationid="data-grid-action-button-hidden"]`)()
    } else {
      return await this.documentRootLocatorFactory().locatorForAll(`[data-automationid="data-grid-action-button"]`)()
    }
  }

  async actionButtonIsDisabled(actionButton: TestElement, viewType: 'list' | 'grid') {
    if(viewType === 'list') {
      return await actionButton.getProperty("disabled")
    } else {
      return await actionButton.hasClass("p-disabled")
    }
  }
}
