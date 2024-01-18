import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface PHarnessFilters extends BaseHarnessFilters {
  class?: string
  id?: string
}

export class PHarness extends ComponentHarness {
  static hostSelector = 'p'

  static with(options: PHarnessFilters): HarnessPredicate<PHarness> {
    return new HarnessPredicate(PHarness, options)
      .addOption('class', options.class, (harness, c) => HarnessPredicate.stringMatches(harness.getByClass(c), c))
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.hasId(id), id))
  }

  async getByClass(c: string): Promise<string> {
    return (await (await this.host()).hasClass(c)) ? c : ''
  }

  async hasId(id: string): Promise<string> {
    return (await (await this.host()).matchesSelector('#' + id)) ? id : ''
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
}
