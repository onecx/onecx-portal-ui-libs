import {
  BaseHarnessFilters,
  ContentContainerComponentHarness,
  HarnessPredicate,
  TestElement,
  parallel,
} from '@angular/cdk/testing'
import {
  TableHeaderColumnHarness,
  TableRowHarness,
  PPaginatorHarness,
  PTableCheckboxHarness,
  PMenuHarness,
  MenuItemHarness,
} from '@onecx/angular-testing'

export interface DataTableHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class DataTableHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-table'

  static with(options: DataTableHarnessFilters): HarnessPredicate<DataTableHarness> {
    return new HarnessPredicate(DataTableHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }

  getHeaderColumns = this.locatorForAll(TableHeaderColumnHarness)
  getRows = this.locatorForAll(TableRowHarness)
  getPaginator = this.locatorFor(PPaginatorHarness)
  getOverflowMenu = this.locatorForOptional(PMenuHarness)

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

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

  async getOverflowActionMenuButton() {
    return await this.locatorForOptional('[name="data-table-overflow-action-button"]')()
  }

  async getOverFlowMenuItems() {
    const menu = await this.getOverflowMenu()
    const menuItems = await menu?.getAllMenuItems()
    return menuItems ?? []
  }

  async getOverFlowMenuItem(itemText: string): Promise<MenuItemHarness | undefined | null> {
    const menu = await this.getOverflowMenu()
    return await menu?.getMenuItem(itemText)
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
    return await column.hasClass('p-datatable-frozen-column')
  }
}
