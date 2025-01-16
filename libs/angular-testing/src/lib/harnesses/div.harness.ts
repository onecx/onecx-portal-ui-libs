import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface DivHarnessFilters extends BaseHarnessFilters {
  class?: string
  id?: string
}

export class DivHarness extends ComponentHarness {
  static hostSelector = 'div'

  static with(options: DivHarnessFilters): HarnessPredicate<DivHarness> {
    return new HarnessPredicate(DivHarness, options)
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
      .addOption('class', options.class, (harness, c) => HarnessPredicate.stringMatches(harness.getByClass(c), c)
    )
  }

  async getByClass(c: string): Promise<string> {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async checkHasClass(value: string) {
    return await (await this.host()).hasClass(value)
  }

  async getText(): Promise<string> {
    return await (await this.host()).text()
  }

  async getClassList() {
    const host = await this.host()
    const attributeString = await host.getAttribute('class')
    if (attributeString) {
      return attributeString.trim().split(' ')
    }
    return []
  }

  async click(): Promise<void> {
    await (await this.host()).click()
  }
}
