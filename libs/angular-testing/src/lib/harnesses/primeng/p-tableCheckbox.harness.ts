import {
  BaseHarnessFilters,
  ComponentHarness,
  ComponentHarnessConstructor,
  HarnessPredicate,
} from '@angular/cdk/testing'

export interface PTableCheckboxHarnessFilter extends BaseHarnessFilters {
  isSelected?: boolean
}

export class PTableCheckboxHarness extends ComponentHarness {
  static hostSelector = 'p-tablecheckbox'

  static with<T extends PTableCheckboxHarness>(
    this: ComponentHarnessConstructor<T>,
    options: PTableCheckboxHarnessFilter = {}
  ): HarnessPredicate<T> {
    return new HarnessPredicate(this, options).addOption(
      'isSelected',
      options.isSelected,
      async (harness, selected) => {
        return (await harness.isChecked()) === selected
      }
    )
  }

  async isChecked(): Promise<boolean> {
    const allChecked = await this.locatorForAll('.p-checkbox-box .p-icon')()
    return allChecked.length === 1
  }

  async checkBox(): Promise<void> {
    const checkBoxElement = await this.locatorFor('.p-checkbox-input')()
    return checkBoxElement.click()
  }
}
