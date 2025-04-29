import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface PToggleButtonHarnessFilters extends BaseHarnessFilters {
  onLabel?: string
}

export class PToggleButtonHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-togglebutton'

  static with(options: PToggleButtonHarnessFilters): HarnessPredicate<PToggleButtonHarness> {
    return new HarnessPredicate(PToggleButtonHarness, options).addOption(
      'onLabel',
      options.onLabel,
      (harness, onLabel) => HarnessPredicate.stringMatches(harness.getOnLabel(), onLabel)
    )
  }

  async getOnLabel() {
    return await (await this.host()).getAttribute('ng-reflect-on-label')
  }

  async click() {
    await (await this.host()).click()
  }
}
