import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface MenuItemHarnessFilters extends BaseHarnessFilters {
  text?: string
}

export class MenuItemHarness extends ComponentHarness {
  static hostSelector = 'li>div>a'

  static with(options: MenuItemHarnessFilters): HarnessPredicate<MenuItemHarness> {
    return new HarnessPredicate(MenuItemHarness, options).addOption('text', options.text, (harness, text) =>
      HarnessPredicate.stringMatches(harness.getText(), text)
    )
  }

  async getText(): Promise<string> {
    return await (await this.host()).text()
  }

  async selectItem() {
    await (await this.host()).click()
  }

  async getLink(): Promise<string | null> {
    return await (await this.host()).getAttribute('href')
  }
}
