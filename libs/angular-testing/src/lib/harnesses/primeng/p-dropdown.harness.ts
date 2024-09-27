import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { ListItemHarness } from '../list-item.harness'

export interface PDropdownHarnessFilters extends BaseHarnessFilters {
  id?: string
  inputId?: string
}

export class PDropdownHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-dropdown'

  static with(options: PDropdownHarnessFilters): HarnessPredicate<PDropdownHarness> {
    return new HarnessPredicate(PDropdownHarness, options)
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
      .addOption('inputId', options.inputId, (harness, inputId) =>
        HarnessPredicate.stringMatches(harness.getInputId(), inputId)
      )
  }

  async getInputId(): Promise<string | null> {
    return await (await this.host()).getAttribute('inputId')
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getDefaultText() {
    return (await this.locatorForOptional('span.p-placeholder')())?.text()
  }

  async isOpen(): Promise<boolean> {
    return (await this.locatorFor('div')()).hasClass('p-dropdown-open')
  }

  async open() {
    if (!(await this.isOpen())) {
      await (await this.locatorFor('div')()).click()
    } else {
      console.warn('Unable to open dropdown, because it is already open.')
    }
  }

  async close() {
    if (await this.isOpen()) {
      await (await this.locatorFor('div')()).click()
    } else {
      console.warn('Unable to close dropdown, because it is not open.')
    }
  }

  async getDropdownItems() {
    await this.open()
    const rootLocator = this.documentRootLocatorFactory()
    const items = await rootLocator.harnessLoaderFor('.p-dropdown-items')
    return await items.getAllHarnesses(ListItemHarness)
  }

  async getDropdownItem(itemText: string): Promise<ListItemHarness | null> {
    return await this.locatorForOptional(ListItemHarness.with({ text: itemText }))()
  }

  async selectedDropdownItem(position: number) {
    const selectedColumnGroup = await Promise.all(
      (await this.getDropdownItems()).filter((listItem) => listItem.isSelected())
    )
    return selectedColumnGroup[position]
  }

  async selectedDropdownItemText(position: number) {
    return (await this.selectedDropdownItem(position)).getText()
  }

  async hasClearOption() {
    return (await this.locatorFor('div')()).hasClass('p-dropdown-clearable')
  }

  async clear() {
    if (await this.hasClearOption()) {
      return await (await this.locatorFor('.p-dropdown-clear-icon')()).click()
    } else {
      console.warn('Unable to clear dropdown, because it has no clear option')
    }
  }
}
