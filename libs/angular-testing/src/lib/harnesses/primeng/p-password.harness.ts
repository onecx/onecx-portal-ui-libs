import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import { InputHarness } from '@onecx/angular-testing'

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
    return await (await this.host()).getAttribute('ng-reflect-prompt-label')
  }

  async getWeakLabel(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-weak-label')
  }

  async getMediumLabel(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-medium-label')
  }

  async getStrongLabel(): Promise<string | null> {
    return await (await this.host()).getAttribute('ng-reflect-strong-label')
  }

  async getValue(): Promise<string | null> {
    return await (await this.getInput()).getValue()
  }

  async setValue(value: string) {
    return await (await this.getInput()).setValue(value)
  }
}
