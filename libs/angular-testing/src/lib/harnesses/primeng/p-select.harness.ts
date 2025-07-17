import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { ListItemHarness } from '../list-item.harness'

export interface PSelectHarnessFilters extends BaseHarnessFilters {
  id?: string
  inputId?: string
}

export class PSelectHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-select'

  static with(options: PSelectHarnessFilters): HarnessPredicate<PSelectHarness> {
    return new HarnessPredicate(PSelectHarness, options)
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
      .addOption('inputId', options.inputId, (harness, inputId) =>
        HarnessPredicate.stringMatches(harness.getInputId(), inputId)
      )
  }

  async getInputId(): Promise<string | null> {
    return await (await this.host()).getAttribute('inputId')
  }

  async getAriaLabel(): Promise<string | null | undefined> {
    return (await this.locatorForOptional('span.p-placeholder')())?.getAttribute('aria-label')
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getDefaultText() {
    return (await this.locatorForOptional('span.p-placeholder')())?.text()
  }

  async getSelectedText() {
    return (await this.locatorForOptional('span.p-select-label')())?.text()
  }

  async isOpen(): Promise<boolean> {
    return (await this.host()).hasClass('p-select-open')
  }

  async open() {
    if (!(await this.isOpen())) {
      await (await this.locatorFor('div')()).click()
    } else {
      console.warn('Unable to open p-select, because it is already open.')
    }
  }

  async close() {
    if (await this.isOpen()) {
      await (await this.locatorFor('div')()).click()
    } else {
      console.warn('Unable to close p-select, because it is not open.')
    }
  }

  async getSelectItems() {
    await this.open()
    const rootLocator = this.documentRootLocatorFactory()
    const items = await rootLocator.harnessLoaderFor('.p-select-list')
    return await items.getAllHarnesses(ListItemHarness)
  }

  async getSelectItem(itemText: string): Promise<ListItemHarness | null> {
    return await this.locatorForOptional(ListItemHarness.with({ text: itemText }))()
  }

  async selectedSelectItem(position: number) {
    const selectedColumnGroup = await Promise.all(
      (await this.getSelectItems()).filter((listItem) => listItem.isSelected())
    )
    return selectedColumnGroup[position]
  }

  async selectedSelectItemText(position: number) {
    return (await this.selectedSelectItem(position)).getText()
  }

  async hasClearOption() {
    return (await this.locatorFor('div')()).hasClass('p-select-clearable')
  }

  async clear() {
    if (await this.hasClearOption()) {
      return await (await this.locatorFor('.p-select-clear-icon')()).click()
    } else {
      console.warn('Unable to clear p-select, because it has no clear option')
    }
  }
}
