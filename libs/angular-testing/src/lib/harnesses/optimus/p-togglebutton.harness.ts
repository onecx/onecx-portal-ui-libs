import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'

export interface PToggleButtonHarnessFilters extends BaseHarnessFilters {
  onLabel?: string
  checked?: boolean
}

export class PToggleButtonHarness extends ContentContainerComponentHarness {
  static hostSelector = 'p-togglebutton'

  static with(options: PToggleButtonHarnessFilters = {}): HarnessPredicate<PToggleButtonHarness> {
    return new HarnessPredicate(PToggleButtonHarness, options)
      .addOption('onLabel', options.onLabel, (harness, onLabel) => HarnessPredicate.stringMatches(harness.getOnLabel(), onLabel))
      .addOption('checked', options.checked, async (harness, checked) => (await harness.isChecked()) === checked)
  }

  async getOnLabel(): Promise<string | null> {
    const host = await this.host()
    const onLabel = await host.getAttribute('onlabel')
    if (onLabel) {
      return onLabel
    }

    const srOnly = await this.locatorForOptional('.sr-only')()
    return srOnly ? await srOnly.getAttribute('id') : null
  }

  async isChecked(): Promise<boolean> {
    const host = await this.host()
    return await host.hasClass('p-togglebutton-checked')
  }

  async click() {
    await (await this.host()).click()
  }
}
