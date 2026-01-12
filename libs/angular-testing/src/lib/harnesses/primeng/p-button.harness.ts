import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { SpanHarness } from '../span.harness'

export interface PButtonHarnessFilters extends BaseHarnessFilters {
  id?: string
  name?: string
  label?: string
  icon?: string
}

export class PButtonHarness extends ComponentHarness {
  static hostSelector = 'p-button'

  getLabelSpan = this.locatorForOptional(SpanHarness.without({ classes: ['p-badge', 'p-button-icon'] }))
  getIconSpan = this.locatorForOptional(SpanHarness.with({ class: 'p-button-icon' }))
  getLoadingIcon = this.locatorFor('spinnericon')

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
    return (await (await this.getLabelSpan())?.getText()) ?? null
  }

  async getIcon(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-icon')
  }

  async click() {
    await (await this.locatorFor('button')()).click()
  }

  async getBadgeValue() {
    return await (await this.host()).getAttribute('ng-reflect-badge')
  }
}
