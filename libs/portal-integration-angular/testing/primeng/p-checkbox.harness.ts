import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { DivHarness, DivHarnessFilters } from '../div.harness'
import { InputHarness } from '../input.harness'

export interface PCheckBoxHarnessFilters extends BaseHarnessFilters {
  inputid?: string
}
export class PCheckboxHarness extends ComponentHarness {
  static hostSelector = 'p-checkbox'

  static with(options: PCheckBoxHarnessFilters): HarnessPredicate<PCheckboxHarness> {
    return new HarnessPredicate(PCheckboxHarness, options).addOption('inputid', options.inputid, (harness, inputid) =>
      HarnessPredicate.stringMatches(harness.getId(), inputid)
    )
  }

  getCheckBoxDiv = this.locatorForOptional(DivHarness.with({ class: 'p-checkbox-box' }))

  async isChecked(): Promise<boolean> {
    return (await this.locatorFor(InputHarness)()).getChecked()
  }

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('inputId')
  }
  async isHidden(): Promise<boolean> {
    const attr = await (await this.host()).getAttribute('hidden')
    return Boolean(attr)
  }

  async click(): Promise<void> {
    await (await this.getCheckBoxDiv())?.click()
  }
}
