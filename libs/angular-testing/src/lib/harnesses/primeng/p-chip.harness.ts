import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface PChipHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class PChipHarness extends ComponentHarness {
  static hostSelector = 'p-chip'

  static with(options: PChipHarnessFilters): HarnessPredicate<PChipHarness> {
    return new HarnessPredicate(PChipHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  getRemoveButton = this.locatorForOptional('.p-chip-remove-icon')

  async getContent() {
    return await (await this.host()).text()
  }

  async clickRemove() {
    await (await this.getRemoveButton())?.click()
  }

  async click() {
    await (await this.host()).click()
  }
}
