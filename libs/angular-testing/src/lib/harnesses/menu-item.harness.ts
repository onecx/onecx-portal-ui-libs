import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface MenuItemHarnessFilters extends BaseHarnessFilters {
  text?: string
}

export class MenuItemHarness extends ComponentHarness {
  static hostSelector = 'li > a'

  static with(options: MenuItemHarnessFilters): HarnessPredicate<MenuItemHarness> {
    return new HarnessPredicate(MenuItemHarness, options).addOption('text', options.text, (harness, text) =>
      HarnessPredicate.stringMatches(harness.getText(), text)
    )
  }

  async getText() {
    return await (await this.host()).text()
  }

  async selectItem() {
    await (await this.host()).click()
  }
}
