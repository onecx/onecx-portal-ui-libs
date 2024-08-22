import { ContentContainerComponentHarness, TestElement, parallel } from '@angular/cdk/testing'
import {
  TableHeaderColumnHarness,
  TableRowHarness,
  PPaginatorHarness,
  PTableCheckboxHarness,
} from '@onecx/angular-testing'

export class DataTableHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-table'

  getHeaderColumns = this.locatorForAll(TableHeaderColumnHarness)
  getRows = this.locatorForAll(TableRowHarness)
  getPaginator = this.locatorFor(PPaginatorHarness)

  async rowSelectionIsEnabled(): Promise<boolean> {
    const pTableCheckbox = await this.getHarnessesForCheckboxes('all')
    return pTableCheckbox.length > 0
  }

  async getHarnessesForCheckboxes(type: 'all' | 'checked' | 'unchecked'): Promise<PTableCheckboxHarness[]> {
    let checkBoxHarnesses: PTableCheckboxHarness[]
    if (type === 'checked') {
      checkBoxHarnesses = await this.getAllHarnesses(PTableCheckboxHarness.with({ isSelected: true }))
      return checkBoxHarnesses
    }
    if (type === 'unchecked') {
      checkBoxHarnesses = await this.getAllHarnesses(PTableCheckboxHarness.with({ isSelected: false }))
      return checkBoxHarnesses
    } else {
      checkBoxHarnesses = await this.getAllHarnesses(PTableCheckboxHarness)
      return checkBoxHarnesses
    }
  }

  async getActionColumnHeader(position: 'left' | 'right') {
    return await this.locatorForOptional(`[name="action-column-header-${position}"]`)()
  }

  async getActionColumn(position: 'left' | 'right') {
    return await this.locatorForOptional(`[name="action-column-${position}"]`)()
  }

  async getActionButtons() {
    return await this.locatorForAll(`[name="data-table-action-button"]`)()
  }

  async actionButtonIsDisabled(actionButton: TestElement) {
    const isDisabled = await actionButton.getProperty('disabled')
    return isDisabled
  }

  async hasAmountOfActionButtons(amount: number) {
    return (await this.getActionButtons()).length === amount
  }

  async hasAmountOfDisabledActionButtons(amount: number) {
    let disabledActionButtonsCount = 0
    const actionButtons = await this.getActionButtons()
    await parallel(() =>
      actionButtons.map(async (actionButton) => {
        if ((await this.actionButtonIsDisabled(actionButton)) === true) {
          disabledActionButtonsCount++
        }
      })
    )
    return disabledActionButtonsCount === amount
  }

  async columnIsFrozen(column: TestElement | null | undefined) {
    if (column === null || column === undefined) {
      throw new Error('Given column is null')
    }
    return await column.hasClass('p-frozen-column')
  }
}
