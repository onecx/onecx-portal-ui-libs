import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface PButtonHarnessFilters extends BaseHarnessFilters {
  id?: string
  name?: string
  label?: string
  icon?: string
}

export class PButtonHarness extends ComponentHarness {
  static hostSelector = 'p-button'

  static with(options: PButtonHarnessFilters): HarnessPredicate<PButtonHarness> {
    return new HarnessPredicate(PButtonHarness, options)
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
      .addOption('name', options.name, (harness, name) => HarnessPredicate.stringMatches(harness.getName(), name))
      .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label))
      .addOption('icon', options.icon, (harness, icon) => HarnessPredicate.stringMatches(harness.getIcon(), icon))
  }
  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getName(): Promise<string | null> {
    return await (await this.host()).getAttribute('name')
  }

  async getLabel(): Promise<string | null> {
    return await (await this.host()).text()
  }

  async getIcon(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-icon')
  }

  async click() {
    await (await this.locatorFor('button')()).click()
  }
}
