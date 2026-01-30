import { ContentContainerComponentHarness, TestElement, parallel } from '@angular/cdk/testing'
import { PMenuHarness, PPaginatorHarness, waitForDeferredViewsToBeRendered } from '@onecx/angular-testing'
import { DefaultGridItemHarness } from './default-grid-item.harness'
import { DefaultListItemHarness } from './default-list-item.harness'

export class DataListGridHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-list-grid'

  getDefaultGridItems = this.locatorForAll(DefaultGridItemHarness)
  getPaginator = this.locatorFor(PPaginatorHarness)
  getGridMenuButton = this.locatorFor(`[name="data-grid-item-menu-button"]`)
  getListOverflowMenuButton = this.locatorFor(`[name="data-list-overflow-item-menu-button"]`)
  getListOverflowMenu = this.locatorForOptional(PMenuHarness)

  async getDefaultListItems() {
    await waitForDeferredViewsToBeRendered(this)
    return await this.locatorForAll(DefaultListItemHarness)()
  }

  async getActionButtons(actionButtonType: 'list' | 'grid' | 'grid-hidden') {
    if (actionButtonType === 'list') {
      return await this.locatorForAll(`[name="data-list-action-button"]`)()
    } else if (actionButtonType === 'grid-hidden') {
      return await this.documentRootLocatorFactory().locatorForAll(
        `li:has([data-automationid="data-grid-action-button-hidden"])`
      )()
    } else {
      return await this.documentRootLocatorFactory().locatorForAll(
        `li:has([data-automationid="data-grid-action-button"])`
      )()
    }
  }

  async getListOverflowMenuItems() {
    const menu = await this.getListOverflowMenu()
    const menuItems = await menu?.getAllMenuItems()
    return menuItems ?? []
  }

  async actionButtonIsDisabled(actionButton: TestElement, viewType: 'list' | 'grid'): Promise<boolean> {
    if (viewType === 'list') {
      return await actionButton.getProperty('disabled')
    } else {
      const ariaDisabled = await actionButton.getAttribute('aria-disabled')

      if (ariaDisabled === 'true') {
        return true
      }

      return false
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
