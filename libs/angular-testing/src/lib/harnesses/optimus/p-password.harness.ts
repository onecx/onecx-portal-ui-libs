import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { InputHarness } from '../input.harness'

export interface PPasswordHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class PPasswordHarness extends ComponentHarness {
  static hostSelector = 'p-password'

  getInput = this.locatorFor(InputHarness)

  static with(options: PPasswordHarnessFilters): HarnessPredicate<PPasswordHarness> {
    return new HarnessPredicate(PPasswordHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }
  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async getPromptLabel(): Promise<string | null> {
    return await (await this.host()).getAttribute('promptlabel')
  }

  async getWeakLabel(): Promise<string | null> {
    return await (await this.host()).getAttribute('weaklabel')
  }

  async getMediumLabel(): Promise<string | null> {
    return await (await this.host()).getAttribute('mediumlabel')
  }

  async getStrongLabel(): Promise<string | null> {
    return await (await this.host()).getAttribute('stronglabel')
  }

  async getValue(): Promise<string | null> {
    return await (await this.getInput()).getValue()
  }

  async setValue(value: string) {
    return await (await this.getInput()).setValue(value)
  }
}
