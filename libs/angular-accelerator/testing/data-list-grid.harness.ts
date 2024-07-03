import { ContentContainerComponentHarness, TestElement } from '@angular/cdk/testing'
import { PPaginatorHarness } from '@onecx/angular-testing'
import { DefaultGridItemHarness } from './default-grid-item.harness'
import { DefaultListItemHarness } from './default-list-item.harness'

export class DataListGridHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-list-grid'

  getDefaultGridItems = this.locatorForAll(DefaultGridItemHarness)
  getDefaultListItems = this.locatorForAll(DefaultListItemHarness)
  getPaginator = this.locatorFor(PPaginatorHarness)
  getMenuButton = this.locatorFor(`[name="data-grid-item-menu-button"]`)

  async getActionButtons(actionButtonType: 'list' | 'grid' | 'grid-hidden') {
    if (actionButtonType === 'list') {
      return await this.locatorForAll(`[name="data-list-action-button"]`)()
    } else if (actionButtonType === 'grid-hidden') {
      return await this.documentRootLocatorFactory().locatorForAll(
        `[data-automationid="data-grid-action-button-hidden"]`
      )()
    } else {
      return await this.documentRootLocatorFactory().locatorForAll(`[data-automationid="data-grid-action-button"]`)()
    }
  }

  async actionButtonIsDisabled(actionButton: TestElement, viewType: 'list' | 'grid') {
    if (viewType === 'list') {
      return await actionButton.getProperty('disabled')
    } else {
      return await actionButton.hasClass('p-disabled')
    }
  }

  async hasAmountOfActionButtons(actionButtonType: 'list' | 'grid' | 'grid-hidden', amount: number) {
    return (await this.getActionButtons(actionButtonType)).length === amount
  }

  async hasAmountOfDisabledActionButtons(viewType: 'list' | 'grid', amount: number) {
    let disabledActionButtons = []
    if (viewType === 'list') {
      disabledActionButtons = await this.documentRootLocatorFactory().locatorForAll(
        `[name="data-list-action-button"]:disabled`
      )()
    } else {
      disabledActionButtons = await this.documentRootLocatorFactory().locatorForAll(
        `p-menuitem-link p-disabled`
      )()
    }
    return disabledActionButtons.length === amount
  }
}
