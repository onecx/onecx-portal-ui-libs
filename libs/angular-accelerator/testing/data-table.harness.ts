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

export interface GroupCellHarnessFilters extends BaseHarnessFilters {
  groupKey?: string
}

export class GroupCellHarness extends ContentContainerComponentHarness {
  static hostSelector = 'th[scope="rowgroup"]'

  static with(options: GroupCellHarnessFilters): HarnessPredicate<GroupCellHarness> {
    return new HarnessPredicate(GroupCellHarness, options).addOption(
      'groupKey',
      options.groupKey,
      (harness, groupKey) => HarnessPredicate.stringMatches(harness.getGroupKey(), groupKey)
    )
  }

  async getGroupKey(): Promise<string | null> {
    return await (await this.host()).getAttribute('id').then(id => id?.replace('group-header-', '') ?? null)
  }

  async getLabel(): Promise<string> {
    // Search for .group-label anywhere within the group cell
    const labelElement = await this.locatorForOptional('.group-label')()
    if (labelElement) {
      return await labelElement.text()
    }
    // Fallback: get all text content and extract label
    const host = await this.host()
    const text = await host.text()
    return text.trim().split('(')[0].trim()
  }

  async getRowspan(): Promise<number> {
    const rowspan = await (await this.host()).getAttribute('rowspan')
    return rowspan ? parseInt(rowspan, 10) : 1
  }

  async getScope(): Promise<string | null> {
    return await (await this.host()).getAttribute('scope')
  }
}

export interface GroupRowHarnessFilters extends BaseHarnessFilters {
  groupKey?: string
}

/** @deprecated Use GroupCellHarness instead. Kept for backward compatibility. */
export class GroupRowHarness extends ContentContainerComponentHarness {
  static hostSelector = 'tr.group-row'

  static with(options: GroupRowHarnessFilters): HarnessPredicate<GroupRowHarness> {
    return new HarnessPredicate(GroupRowHarness, options).addOption(
      'groupKey',
      options.groupKey,
      (harness, groupKey) => HarnessPredicate.stringMatches(harness.getGroupKey(), groupKey)
    )
  }

  async getGroupKey(): Promise<string | null> {
    return await (await this.host()).getAttribute('id').then(id => id?.replace('group-row-', '') ?? null)
  }

  async getGroupLabel(): Promise<string> {
    const labelElement = await this.locatorForOptional('.group-label')()
    if (labelElement) {
      return await labelElement.text()
    }
    const tds = await this.locatorForAll('td')()
    for (const td of tds) {
      const text = await td.text()
      if (text && text.trim() !== '' && !text.includes('(')) {
        return text.trim()
      }
    }
    const spans = await this.locatorForAll('span')()
    for (const span of spans) {
      const text = await span.text()
      if (text && text.trim() !== '' && !text.includes('(')) {
        return text.trim()
      }
    }
    return ''
  }

  async getGroupCount(): Promise<number> {
    const countElement = await this.locatorForOptional('.group-count')()
    if (countElement) {
      const text = await countElement.text()
      const match = text.match(/\((\d+)/)
      return match ? parseInt(match[1], 10) : 0
    }
    const tds = await this.locatorForAll('td')()
    for (const td of tds) {
      const text = await td.text()
      const match = text.match(/\((\d+)/)
      if (match) {
        return parseInt(match[1], 10)
      }
    }
    const spans = await this.locatorForAll('span')()
    for (const span of spans) {
      const text = await span.text()
      const match = text.match(/\((\d+)/)
      if (match) {
        return parseInt(match[1], 10)
      }
    }
    return 0
  }
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
  getGroupCells = this.locatorForAll(GroupCellHarness)
  /** @deprecated Use getGroupCells instead. Kept for backward compatibility. */
  getGroupRows = this.locatorForAll(GroupRowHarness)
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
    return await this.locatorForAll(`[name="data-table-action-button"], [data-testid="data-table-action-button"]`)()
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

  getExpansionColumnHeaderElement = this.locatorForOptional('[name="expansion-column-header"]')
  getExpansionToggleButtonElements = this.locatorForAll('[name="expansion-column"] button')

  async expansionColumnHeaderExists(): Promise<boolean> {
    return (await this.getExpansionColumnHeaderElement()) !== null
  }

  async clickExpansionToggle(rowIndex: number): Promise<void> {
    const buttons = await this.getExpansionToggleButtonElements()
    if (rowIndex >= buttons.length) {
      throw new Error(`No expansion toggle at index ${rowIndex}. Found ${buttons.length} toggle(s).`)
    }
    await buttons[rowIndex].click()
  }

  async getGroupRow(groupKey: string): Promise<GroupRowHarness | null> {
    const harnesses = await this.getGroupRows()
    for (const harness of harnesses) {
      const key = await harness.getGroupKey()
      if (key === groupKey) {
        return harness
      }
    }
    return null
  }

  async getGroupCell(groupKey: string): Promise<GroupCellHarness | null> {
    const harnesses = await this.getGroupCells()
    for (const harness of harnesses) {
      const key = await harness.getGroupKey()
      if (key === groupKey) {
        return harness
      }
    }
    return null
  }

  async getGroupLabels(): Promise<string[]> {
    const harnesses = await this.getGroupCells()
    const labels: string[] = []
    for (const harness of harnesses) {
      labels.push(await harness.getLabel())
    }
    return labels
  }

  async getGroupCounts(): Promise<number[]> {
    const harnesses = await this.getGroupCells()
    const counts: number[] = []
    for (const harness of harnesses) {
      counts.push(await harness.getRowspan())
    }
    return counts
  }

  async isGrouped(): Promise<boolean> {
    const groupCells = await this.getGroupCells()
    return groupCells.length > 0
  }
}