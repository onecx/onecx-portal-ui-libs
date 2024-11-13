import { ContentContainerComponentHarness, TestElement, parallel } from '@angular/cdk/testing'
import { PPaginatorHarness } from '@onecx/angular-testing'
import { DefaultGridItemHarness } from './default-grid-item.harness'
import { DefaultListItemHarness } from './default-list-item.harness'
import { waitForDeferredViewsToBeRendered } from '@onecx/angular-testing'

export class DataListGridHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-list-grid'

  getDefaultGridItems = this.locatorForAll(DefaultGridItemHarness)
  getPaginator = this.locatorFor(PPaginatorHarness)
  getMenuButton = this.locatorFor(`[name="data-grid-item-menu-button"]`)

  async getDefaultListItems() {
    await waitForDeferredViewsToBeRendered(this)
    return await this.locatorForAll(DefaultListItemHarness)()
  }

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

  async actionButtonIsDisabled(actionButton: TestElement, viewType: 'list' | 'grid'): Promise<boolean> {
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
    let disabledActionButtonsCount = 0
    const actionButtons = await this.getActionButtons(viewType)
    await parallel(() =>
      actionButtons.map(async (actionButton) => {
        if ((await this.actionButtonIsDisabled(actionButton, viewType)) === true) {
          disabledActionButtonsCount++
        }
      })
    )
    return disabledActionButtonsCount === amount
  }
}
