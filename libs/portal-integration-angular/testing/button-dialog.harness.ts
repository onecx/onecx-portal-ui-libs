import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { PButtonDirectiveHarness } from './primeng/p-button-directive.harness'

export class ButtonDialogHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-button-dialog'

  getPrimaryButton = this.locatorFor(PButtonDirectiveHarness.with({ id: 'buttonDialogPrimaryButton' }))
  getSecondaryButton = this.locatorForOptional(PButtonDirectiveHarness.with({ id: 'buttonDialogSecondaryButton' }))

  async clickPrimaryButton() {
    await (await this.getPrimaryButton()).click()
  }

  async clickSecondaryButton() {
    await (await this.getSecondaryButton())?.click()
  }

  async getPrimaryButtonLabel(): Promise<string | null> {
    return await (await this.getPrimaryButton()).getLabel()
  }

  async getPrimaryButtonIcon(): Promise<string | null> {
    return await (await this.getPrimaryButton()).getIcon()
  }

  async getSecondaryButtonLabel(): Promise<string | null | undefined> {
    return await (await this.getSecondaryButton())?.getLabel()
  }

  async getSecondaryButtonIcon(): Promise<string | null | undefined> {
    return await (await this.getSecondaryButton())?.getIcon()
  }

  async getTextFor(selector: string): Promise<string | undefined> {
    const element = await this.locatorForOptional(selector)
    return await (await element())?.text()
  }

  async getAttributeFor(selector: string, attribute: string): Promise<string | null | undefined> {
    const element = await this.locatorForOptional(selector)
    return await (await element())?.getAttribute(attribute)
  }

  async getPrimaryButtonDisabled(): Promise<boolean> {
    return await (await this.getPrimaryButton()).getDisabled()
  }

  async getSecondaryButtonDisabled(): Promise<boolean | undefined> {
    return await (await this.getSecondaryButton())?.getDisabled()
  }
}
