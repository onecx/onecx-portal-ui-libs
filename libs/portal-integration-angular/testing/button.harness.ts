import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface ButtonHarnessFilters extends BaseHarnessFilters {
  id?: string
  icon?: string
  class?: string
}

export class ButtonHarness extends ComponentHarness {
  static hostSelector = 'button'

  static with(options: ButtonHarnessFilters): HarnessPredicate<ButtonHarness> {
    return new HarnessPredicate(ButtonHarness, options)
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
      .addOption('icon', options.icon, (harness, icon) => HarnessPredicate.stringMatches(harness.getIcon(), icon))
      .addOption('class', options.class, (harness, c) => HarnessPredicate.stringMatches(harness.getByClass(c), c))
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }
  async getIcon(): Promise<string | null> {
    return await (await this.host()).getAttribute('icon')
  }
  async getByClass(c: string): Promise<string | null> {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }

  async click() {
    if (!(await this.isDisabled())) {
      await (await this.host()).click()
    } else {
      console.warn('Button cannot be clicked, because it is disabled!')
    }
  }

  async isDisabled(): Promise<boolean> {
    return await (await this.host()).getProperty('disabled')
  }
}
