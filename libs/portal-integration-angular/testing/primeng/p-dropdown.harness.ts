import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { ListItemHarness } from '../list-item.harness'

export interface PDropdownHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class PDropdownHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-dropdown'

  static with(options: PDropdownHarnessFilters): HarnessPredicate<PDropdownHarness> {
    return new HarnessPredicate(PDropdownHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
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
    const dropdownItems = this.locatorForAll(ListItemHarness)()
    return await dropdownItems
  }

  async selectedDropdownItem() {
    const selectedColumnGroup = await Promise.all(
      (await this.getDropdownItems()).filter((listItem) => listItem.isSelected())
    )
    return selectedColumnGroup[0]
  }

  async selectedDropdownItemText() {
    return (await this.selectedDropdownItem()).getText()
  }
}
