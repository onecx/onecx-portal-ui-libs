import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface DivHarnessFilters extends BaseHarnessFilters {
  class?: string
}

export class DivHarness extends ComponentHarness {
  static hostSelector = 'div'

  static with(options: DivHarnessFilters): HarnessPredicate<DivHarness> {
    return new HarnessPredicate(DivHarness, options).addOption('class', options.class, (harness, c) =>
      HarnessPredicate.stringMatches(harness.getByClass(c), c)
    )
  }

  async getByClass(c: string): Promise<string> {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }

  async checkHasClass(value: string) {
    return await (await this.host()).hasClass(value)
  }

  async getText(): Promise<string> {
    return await (await this.host()).text()
  }
}
