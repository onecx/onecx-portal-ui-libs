import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface ListItemHarnessFilters extends BaseHarnessFilters {
  text?: string
}

export class ListItemHarness extends ComponentHarness {
  static hostSelector = 'li'

  static with(options: ListItemHarnessFilters): HarnessPredicate<ListItemHarness> {
    return new HarnessPredicate(ListItemHarness, options).addOption('text', options.text, (harness, text) =>
      HarnessPredicate.stringMatches(harness.getText(), text)
    )
  }

  async getText() {
    return await (await this.host()).text()
  }

  async isSelected(): Promise<boolean> {
    return (await (await this.host()).getAttribute('aria-selected')) === 'true' ? true : false
  }

  async selectItem() {
    await (await this.host()).click()
  }
}
