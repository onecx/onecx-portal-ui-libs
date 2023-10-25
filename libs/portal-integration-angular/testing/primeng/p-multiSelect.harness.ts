import { BaseHarnessFilters, ComponentHarness, HarnessLoader, HarnessPredicate } from '@angular/cdk/testing'
import { PMultiSelectListItemHarness } from './p-multiSelectListItem.harness'

export interface PMultiSelectHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class PMultiSelectHarness extends ComponentHarness {
  static hostSelector = 'p-multiSelect'

  static with(options: PMultiSelectHarnessFilters): HarnessPredicate<PMultiSelectHarness> {
    return new HarnessPredicate(PMultiSelectHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getHarnessLoaderForPMultiSelectPanel(): Promise<HarnessLoader> {
    const rootLocator = this.documentRootLocatorFactory()
    return rootLocator.harnessLoaderFor('.p-multiselect-panel')
  }

  async getAllOptions(): Promise<PMultiSelectListItemHarness[]> {
    if (!(await this.isOpen())) {
      await this.open()
    }
    return await (await this.getHarnessLoaderForPMultiSelectPanel()).getAllHarnesses(PMultiSelectListItemHarness)
  }

  async isOpen(): Promise<boolean> {
    return await (await this.locatorFor('div')()).hasClass('p-multiselect-open')
  }

  async open() {
    if (!(await this.isOpen())) {
      await (await this.locatorFor('div')()).click()
    } else {
      console.warn('Unable to open multiSelect, because it is already open.')
    }
  }

  async close() {
    if (await this.isOpen()) {
      await (await this.locatorFor('div')()).click()
    } else {
      console.warn('Unable to close multiSelect, because it is not open.')
    }
  }

  async isHighlighted(PMultiSelectListItem: PMultiSelectListItemHarness): Promise<boolean> {
    return await (await PMultiSelectListItem.getTestElement()).hasClass('p-highlight')
  }

  async getSelectedOptions(): Promise<string[] | null> {
    const allOptions = await this.getAllOptions()
    const selectedOptions: string[] = []
    for (let index = 0; index < allOptions.length; index++) {
      const option = allOptions[index]
      if (await this.isHighlighted(option)) {
        selectedOptions.push(await option.getText())
      }
    }
    return selectedOptions
  }
}
