import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface SpanHarnessFilters extends BaseHarnessFilters {
  class?: string
}

export class SpanHarness extends ComponentHarness {
  static hostSelector = 'span'

  static with(options: SpanHarnessFilters): HarnessPredicate<SpanHarness> {
    return new HarnessPredicate(SpanHarness, options).addOption('class', options.class, (harness, c) =>
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