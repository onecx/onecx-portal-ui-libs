import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface PButtonHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class PButtonHarness extends ComponentHarness {
  static hostSelector = 'p-button'

  getButton = this.locatorFor('button')

  static with(options: PButtonHarnessFilters): HarnessPredicate<PButtonHarness> {
    return new HarnessPredicate(PButtonHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async click() {
    await (await this.getButton()).click()
  }

  async getLabel(): Promise<string | null> {
    return await (await this.getButton()).text()
  }

  async getIcon(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-icon')
  }
}
